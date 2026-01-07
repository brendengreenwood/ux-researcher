'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteExerciseDialog } from '@/components/delete-exercise-dialog'

interface ExerciseDetailHeaderProps {
  projectId: string
  personaId: string
  exerciseId: string
  exerciseName: string
  exerciseDescription: string | null
  exerciseType: string
}

export function ExerciseDetailHeader({
  projectId,
  personaId,
  exerciseId,
  exerciseName,
  exerciseDescription,
  exerciseType,
}: ExerciseDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{exerciseName}</h1>
            <Badge variant="secondary">{exerciseType}</Badge>
          </div>
          {exerciseDescription && (
            <p className="text-muted-foreground">{exerciseDescription}</p>
          )}
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Exercise
        </Button>
      </div>
      <DeleteExerciseDialog
        projectId={projectId}
        personaId={personaId}
        exerciseId={exerciseId}
        exerciseName={exerciseName}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
