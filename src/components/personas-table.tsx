'use client'

import { Badge } from '@/components/ui/badge'
import { ActionButtons, ActionItem } from '@/components/action-buttons'
import { Trash2 } from 'lucide-react'

interface Persona {
  id: string
  name: string
  description: string | null
  characteristics: string | null
  _count: {
    interviews: number
  }
}

interface PersonasTableProps {
  projectId: string
  initialPersonas: Persona[]
  highlightedId?: string | null
  deletingId?: string | null
  onRowClick?: (personaId: string) => void
  onDeleteClick?: (personaId: string, personaName: string) => void
}

export function PersonasTable({ projectId, initialPersonas, highlightedId, deletingId, onRowClick, onDeleteClick }: PersonasTableProps) {
  const handleRowClick = (personaId: string, e: React.MouseEvent) => {
    // Skip navigation if clicking on a button
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="menuitem"]')) {
      return
    }

    onRowClick?.(personaId)
    // Allow natural navigation if not clicking on the highlight row
    if (highlightedId !== personaId) {
      window.location.href = `/projects/${projectId}/personas/${personaId}`
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {initialPersonas.map((persona) => {
            const actions: ActionItem[] = [
              {
                id: 'delete',
                label: `Delete ${persona.name}`,
                icon: Trash2,
                variant: 'destructive',
                onClick: () => onDeleteClick?.(persona.id, persona.name),
              },
            ]

            return (
              <tr
                key={persona.id}
                onClick={(e) => handleRowClick(persona.id, e)}
                className={`border-b hover:bg-accent transition-colors cursor-pointer ${
                  highlightedId === persona.id ? 'action-button-energy' : ''
                } ${deletingId === persona.id ? 'row-collapse' : ''}`}
              >
                <td className="p-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{persona.name}</h3>
                    {persona.description && (
                      <p className="text-sm text-muted-foreground">
                        {persona.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right whitespace-nowrap">
                  <Badge variant="secondary">
                    {persona._count.interviews} interviews
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
