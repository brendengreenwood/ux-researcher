'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface CreateInterviewDialogProps {
  projectId: string
  personaId: string
  exerciseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (interview: any) => void
}

export function CreateInterviewDialog({
  projectId,
  personaId,
  exerciseId,
  open,
  onOpenChange,
  onSuccess,
}: CreateInterviewDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')

  function handleStartRecording() {
    if (!title.trim()) return

    // Navigate to the recording page with title as query param
    router.push(
      `/projects/${projectId}/personas/${personaId}/exercises/${exerciseId}/interviews/new?title=${encodeURIComponent(title.trim())}`
    )
    setTitle('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <DialogHeader>
            <DialogTitle>Start Interview</DialogTitle>
            <DialogDescription>
              Give your interview a title to get started recording
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interview-title">Interview Title</Label>
              <Input
                id="interview-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., User Interview - Sarah M."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && title.trim()) {
                    handleStartRecording()
                  }
                }}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle('')
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleStartRecording}
              disabled={!title.trim()}
            >
              Create New Interview
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
