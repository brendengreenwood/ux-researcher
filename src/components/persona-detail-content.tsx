'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ResearchExercisesTable } from '@/components/research-exercises-table'
import { CreateExerciseDialog } from '@/components/create-exercise-dialog'
import { DeleteExerciseDialog } from '@/components/delete-exercise-dialog'

interface ResearchExercise {
  id: string
  name: string
  type: string
  description: string | null
  createdAt: Date
  _count: {
    interviews: number
  }
}

interface PersonaDetailContentProps {
  projectId: string
  personaId: string
  exercises: ResearchExercise[]
}

export function PersonaDetailContent({
  projectId,
  personaId,
  exercises: initialExercises,
}: PersonaDetailContentProps) {
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false)
  const [deleteExerciseOpen, setDeleteExerciseOpen] = useState(false)
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null)
  const [deleteExerciseName, setDeleteExerciseName] = useState<string | null>(null)
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null)
  const [exercises, setExercises] = useState(initialExercises)
  const [highlightedExerciseId, setHighlightedExerciseId] = useState<string | null>(null)

  const handleExerciseCreated = (newExercise: any) => {
    const exerciseWithCount: ResearchExercise = {
      ...newExercise,
      _count: newExercise._count || { interviews: 0 }
    }
    setExercises([exerciseWithCount, ...exercises])
    setHighlightedExerciseId(newExercise.id)
  }

  const handleRowClick = (exerciseId: string) => {
    if (highlightedExerciseId === exerciseId) {
      setHighlightedExerciseId(null)
    }
  }

  const handleDeleteClick = (exerciseId: string, exerciseName: string) => {
    setDeleteExerciseId(exerciseId)
    setDeleteExerciseName(exerciseName)
    setDeleteExerciseOpen(true)
  }

  const handleExerciseDeleted = () => {
    if (deleteExerciseId && deleteExerciseName) {
      setDeletingExerciseId(deleteExerciseId)
      toast.success(`Deleted "${deleteExerciseName}"`)
      setTimeout(() => {
        setExercises(exercises.filter(e => e.id !== deleteExerciseId))
        setDeletingExerciseId(null)
      }, 300)
    }
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Research Exercises</h2>

        {exercises.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No research exercises yet</p>
              <Button variant="action" onClick={() => setCreateExerciseOpen(true)}>
                Create your first research exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Button variant="action" onClick={() => setCreateExerciseOpen(true)}>
              New Research Exercise
            </Button>
            <ResearchExercisesTable
              projectId={projectId}
              personaId={personaId}
              initialExercises={exercises}
              highlightedId={highlightedExerciseId}
              deletingId={deletingExerciseId}
              onRowClick={handleRowClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        )}
      </div>
      <CreateExerciseDialog
        projectId={projectId}
        personaId={personaId}
        open={createExerciseOpen}
        onOpenChange={setCreateExerciseOpen}
        onSuccess={handleExerciseCreated}
      />
      {deleteExerciseId && deleteExerciseName && (
        <DeleteExerciseDialog
          projectId={projectId}
          personaId={personaId}
          exerciseId={deleteExerciseId}
          exerciseName={deleteExerciseName}
          open={deleteExerciseOpen}
          onOpenChange={setDeleteExerciseOpen}
          onSuccess={handleExerciseDeleted}
        />
      )}
    </>
  )
}
