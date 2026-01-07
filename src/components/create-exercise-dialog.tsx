'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface CreateExerciseDialogProps {
  projectId: string
  personaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (exercise: any) => void
}

const EXERCISE_TYPES = [
  'Usability Test',
  'Interview',
  'Card Sort',
  'Survey',
  'Tree Test',
  'A/B Test',
  'Field Study',
  'Diary Study',
  'Focus Group',
  'Other'
]

export function CreateExerciseDialog({
  projectId,
  personaId,
  open,
  onOpenChange,
  onSuccess,
}: CreateExerciseDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Interview')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !type) return

    setLoading(true)
    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId,
          name: name.trim(),
          description: description.trim() || undefined,
          type,
        }),
      })

      if (res.ok) {
        const exercise = await res.json()
        setName('')
        setDescription('')
        setType('Interview')
        onOpenChange(false)

        // Call onSuccess callback to update parent state
        if (onSuccess) {
          onSuccess(exercise)
        }
      } else {
        alert('Failed to create research exercise')
      }
    } catch (err) {
      alert('Error creating research exercise')
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
            <DialogTitle>Create Research Exercise</DialogTitle>
            <DialogDescription>
              Define a new research activity for this persona
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q1 2024 Usability Test"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise-type">Exercise Type</Label>
              <Select value={type} onValueChange={setType} disabled={loading}>
                <SelectTrigger id="exercise-type">
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPES.map((exerciseType) => (
                    <SelectItem key={exerciseType} value={exerciseType}>
                      {exerciseType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise-description">Description (Optional)</Label>
              <Textarea
                id="exercise-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is the goal of this research exercise?"
                rows={3}
                disabled={loading}
              />
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
                {loading ? 'Creating...' : 'Create Exercise'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
