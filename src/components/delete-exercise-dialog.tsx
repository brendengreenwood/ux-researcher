'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface DeleteExerciseDialogProps {
  projectId: string
  personaId: string
  exerciseId: string
  exerciseName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteExerciseDialog({
  projectId,
  personaId,
  exerciseId,
  exerciseName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteExerciseDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = `/projects/${projectId}/personas/${personaId}`
        }
      } else {
        console.error('Delete failed:', data)
        alert(`Failed to delete exercise: ${data.error || 'Unknown error'}`)
        setLoading(false)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert(`Error deleting exercise: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Research Exercise</DialogTitle>
          <DialogDescription>
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You are about to permanently delete the research exercise "{exerciseName}" and all associated interviews, recordings, annotations, and analysis. This is irreversible.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Exercise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
