'use client'

import { Badge } from '@/components/ui/badge'
import { ActionButtons, ActionItem } from '@/components/action-buttons'
import { Trash2 } from 'lucide-react'

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

interface ResearchExercisesTableProps {
  projectId: string
  personaId: string
  initialExercises: ResearchExercise[]
  highlightedId?: string | null
  deletingId?: string | null
  onRowClick?: (exerciseId: string) => void
  onDeleteClick?: (exerciseId: string, exerciseName: string) => void
}

export function ResearchExercisesTable({
  projectId,
  personaId,
  initialExercises,
  highlightedId,
  deletingId,
  onRowClick,
  onDeleteClick
}: ResearchExercisesTableProps) {
  const handleRowClick = (exerciseId: string, e: React.MouseEvent) => {
    // Skip navigation if clicking on a button
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="menuitem"]')) {
      return
    }

    onRowClick?.(exerciseId)
    // Allow natural navigation if not clicking on the highlight row
    if (highlightedId !== exerciseId) {
      window.location.href = `/projects/${projectId}/personas/${personaId}/exercises/${exerciseId}`
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {initialExercises.map((exercise) => {
            const actions: ActionItem[] = [
              {
                id: 'delete',
                label: `Delete ${exercise.name}`,
                icon: Trash2,
                variant: 'destructive',
                onClick: () => onDeleteClick?.(exercise.id, exercise.name),
              },
            ]

            return (
              <tr
                key={exercise.id}
                onClick={(e) => handleRowClick(exercise.id, e)}
                className={`border-b hover:bg-accent transition-colors cursor-pointer ${
                  highlightedId === exercise.id ? 'action-button-energy' : ''
                } ${deletingId === exercise.id ? 'row-collapse' : ''}`}
              >
                <td className="p-6">
                  <h3 className="font-semibold text-base mb-2">{exercise.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{exercise._count.interviews} interview{exercise._count.interviews !== 1 ? 's' : ''}</span>
                    <span>{new Date(exercise.createdAt).toLocaleDateString()}</span>
                    {exercise.description && (
                      <span className="truncate max-w-md">{exercise.description}</span>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right whitespace-nowrap">
                  <Badge variant="secondary">
                    {exercise.type}
                  </Badge>
                </td>
                <td className="p-6 flex justify-center">
                  <ActionButtons actions={actions} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
