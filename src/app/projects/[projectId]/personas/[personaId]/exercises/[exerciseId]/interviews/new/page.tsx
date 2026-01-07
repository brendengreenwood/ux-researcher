'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Annotation {
  id: string
  timestamp: number
  content: string
}

export default function NewInterview() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.projectId as string
  const personaId = params.personaId as string
  const exerciseId = params.exerciseId as string
  const initialTitle = searchParams.get('title') || ''

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [title, setTitle] = useState(initialTitle)
  const [saving, setSaving] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000)
      startTimeRef.current = Date.now()

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        setDuration(elapsed)
      }, 100)

      setIsRecording(true)
      setIsPaused(false)
    } catch (err) {
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        startTimeRef.current = Date.now() - (duration * 1000)
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const addAnnotation = () => {
    if (!currentNote.trim()) return
    setAnnotations(prev => [...prev, {
      id: crypto.randomUUID(),
      timestamp: duration,
      content: currentNote.trim(),
    }])
    setCurrentNote('')
  }

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for the interview')
      return
    }
    setSaving(true)

    const formData = new FormData()
    formData.append('personaId', personaId)
    formData.append('exerciseId', exerciseId)
    formData.append('title', title)
    formData.append('annotations', JSON.stringify(annotations.map(a => ({
      timestamp: a.timestamp,
      content: a.content,
    }))))
    if (audioBlob) formData.append('audio', audioBlob, 'recording.webm')

    try {
      const res = await fetch('/api/interviews', { method: 'POST', body: formData })
      if (res.ok) {
        const interview = await res.json()
        router.push(`/projects/${projectId}/personas/${personaId}/exercises/${exerciseId}/interviews/${interview.id}`)
      } else {
        throw new Error('Failed to save')
      }
    } catch (err) {
      alert('Failed to save interview')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>Project</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}/personas/${personaId}`}>Persona</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}/personas/${personaId}/exercises/${exerciseId}`}>Exercise</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Record Interview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Record Interview</h1>
        <p className="text-muted-foreground">
          Capture audio and add timestamped notes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recording</CardTitle>
              {isRecording && (
                <Badge variant={isPaused ? 'secondary' : 'destructive'}>
                  {isPaused ? 'Paused' : 'Recording'}
                </Badge>
              )}
              {audioBlob && !isRecording && <Badge>Recorded</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <div className="text-5xl font-mono font-bold tabular-nums">
                {formatTime(duration)}
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {!isRecording && !audioBlob && (
                <Button onClick={startRecording} size="lg">
                  Start Recording
                </Button>
              )}
              {isRecording && (
                <>
                  <Button onClick={pauseRecording} variant="secondary">
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button onClick={stopRecording} variant="destructive">
                    Stop
                  </Button>
                </>
              )}
              {audioBlob && !isRecording && (
                <Button onClick={startRecording} variant="outline">
                  Record Again
                </Button>
              )}
            </div>

            {audioBlob && (
              <>
                <Separator />
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annotations</CardTitle>
            <CardDescription>Add notes at the current timestamp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    addAnnotation()
                  }
                }}
                rows={2}
                className="flex-1"
              />
              <Button onClick={addAnnotation} disabled={!currentNote.trim()} className="self-end">
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {annotations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No annotations yet
                </p>
              ) : (
                annotations.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 p-2 rounded-md border">
                    <Badge variant="outline" className="shrink-0 font-mono">
                      {formatTime(a.timestamp)}
                    </Badge>
                    <p className="flex-1 text-sm">{a.content}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeAnnotation(a.id)} className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="title">Interview Title</Label>
              <Input
                id="title"
                placeholder="e.g., User Interview - John D."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={saving || (!audioBlob && annotations.length === 0)} size="lg">
              {saving ? 'Saving...' : 'Save Interview'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
