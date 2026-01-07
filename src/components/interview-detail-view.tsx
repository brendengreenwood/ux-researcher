'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Annotation {
  id: string
  timestamp: number
  content: string
}

interface Analysis {
  id: string
  agentName: string
  content: string
  createdAt: Date
}

interface Transcript {
  id: string
  content: string
}

interface InterviewDetailViewProps {
  title: string
  audioUrl: string | null
  annotations: Annotation[]
  transcript: Transcript | null
  analyses: Analysis[]
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function InterviewDetailView({
  title,
  audioUrl,
  annotations,
  transcript,
  analyses,
}: InterviewDetailViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recording</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {audioUrl ? (
            <>
              <audio controls src={audioUrl} className="w-full" />
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No audio recording available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Annotations</CardTitle>
          <CardDescription>{annotations.length} notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {annotations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No annotations for this interview
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {annotations.map((a) => (
                <div key={a.id} className="flex items-start gap-2 p-2 rounded-md border">
                  <Badge variant="outline" className="shrink-0 font-mono">
                    {formatTime(a.timestamp)}
                  </Badge>
                  <p className="flex-1 text-sm">{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transcript</CardTitle>
            {!transcript && audioUrl && (
              <Badge variant="secondary">Pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {transcript ? (
            <p className="text-sm whitespace-pre-wrap">{transcript.content}</p>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                {audioUrl ? 'Transcript not yet generated' : 'No audio recording to transcribe'}
              </p>
              {audioUrl && (
                <p className="text-sm text-muted-foreground">
                  Transcription will be available after processing
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {analyses.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>Insights from AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyses.map((analysis) => {
                const content = JSON.parse(analysis.content)
                return (
                  <div key={analysis.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>{analysis.agentName}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(content, null, 2)}
                    </pre>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
