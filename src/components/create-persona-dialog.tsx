'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface CreatePersonaDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (persona: any) => void
}

export function CreatePersonaDialog({ projectId, open, onOpenChange, onSuccess }: CreatePersonaDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [characteristics, setCharacteristics] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: name.trim(),
          description: description.trim() || undefined,
          characteristics: characteristics.trim() || undefined,
        }),
      })

      if (res.ok) {
        const persona = await res.json()
        setName('')
        setDescription('')
        setCharacteristics('')
        onOpenChange(false)

        // Call onSuccess callback to update parent state and show in table
        if (onSuccess) {
          onSuccess(persona)
        }
      } else {
        alert('Failed to create persona')
      }
    } catch (err) {
      alert('Error creating persona')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <DialogHeader>
            <DialogTitle>Create New Persona</DialogTitle>
            <DialogDescription>
              Define a target user type for your research
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="persona-name">Persona Name</Label>
              <Input
                id="persona-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Power User, First-time Customer"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona-description">Description</Label>
              <Textarea
                id="persona-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Who is this persona? What defines them?"
                rows={2}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona-characteristics">Key Characteristics</Label>
              <Textarea
                id="persona-characteristics"
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                placeholder="Demographics, behaviors, goals, pain points..."
                rows={3}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                These will help AI agents contextualize interview analysis
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Persona'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
