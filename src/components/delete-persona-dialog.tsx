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

interface DeletePersonaDialogProps {
  projectId: string
  personaId: string
  personaName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeletePersonaDialog({
  projectId,
  personaId,
  personaName,
  open,
  onOpenChange,
  onSuccess,
}: DeletePersonaDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/personas/${personaId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = `/projects/${projectId}`
        }
      } else {
        console.error('Delete failed:', data)
        alert(`Failed to delete persona: ${data.error || 'Unknown error'}`)
        setLoading(false)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert(`Error deleting persona: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Persona</DialogTitle>
          <DialogDescription>
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You are about to permanently delete "{personaName}" and all associated interviews. This is irreversible.
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
            {loading ? 'Deleting...' : 'Delete Persona'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
