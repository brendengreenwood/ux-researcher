'use client'

import { Badge } from '@/components/ui/badge'
import { ActionButtons, ActionItem } from '@/components/action-buttons'
import { Trash2 } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: Date
  _count: {
    personas: number
  }
}

interface ProjectsTableProps {
  initialProjects: Project[]
  highlightedId?: string | null
  deletingId?: string | null
  onRowClick?: (projectId: string) => void
  onDeleteClick?: (projectId: string, projectName: string) => void
}

export function ProjectsTable({ initialProjects, highlightedId, deletingId, onRowClick, onDeleteClick }: ProjectsTableProps) {
  const handleRowClick = (projectId: string, e: React.MouseEvent) => {
    // Skip navigation if clicking on a button
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="menuitem"]')) {
      return
    }

    onRowClick?.(projectId)
    // Allow natural navigation if not clicking on the highlight row
    if (highlightedId !== projectId) {
      window.location.href = `/projects/${projectId}`
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {initialProjects.map((project) => {
            const actions: ActionItem[] = [
              {
                id: 'delete',
                label: `Delete ${project.name}`,
                icon: Trash2,
                variant: 'destructive',
                onClick: () => onDeleteClick?.(project.id, project.name),
              },
            ]

            return (
              <tr
                key={project.id}
                onClick={(e) => handleRowClick(project.id, e)}
                className={`border-b hover:bg-accent transition-colors cursor-pointer ${
                  highlightedId === project.id ? 'action-button-energy' : ''
                } ${deletingId === project.id ? 'row-collapse' : ''}`}
              >
                <td className="p-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right whitespace-nowrap">
                  <div className="flex items-center gap-4 justify-end">
                    <Badge variant="secondary">
                      {project._count.personas} personas
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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
