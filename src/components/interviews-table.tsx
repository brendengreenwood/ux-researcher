'use client'

import { Badge } from '@/components/ui/badge'
import { ActionButtons, ActionItem } from '@/components/action-buttons'
import { Trash2 } from 'lucide-react'

interface Interview {
  id: string
  title: string
  status: string
  createdAt: Date
  _count: {
    annotations: number
    analyses: number
  }
}

interface InterviewsTableProps {
  projectId: string
  personaId: string
  exerciseId?: string
  initialInterviews: Interview[]
  statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>
  highlightedId?: string | null
  deletingId?: string | null
  onRowClick?: (interviewId: string) => void
  onDeleteClick?: (interviewId: string, interviewTitle: string) => void
}

export function InterviewsTable({
  projectId,
  personaId,
  exerciseId,
  initialInterviews,
  statusVariants,
  highlightedId,
  deletingId,
  onRowClick,
  onDeleteClick
}: InterviewsTableProps) {
  const handleRowClick = (interviewId: string, e: React.MouseEvent) => {
    // Skip navigation if clicking on a button
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="menuitem"]')) {
      return
    }

    onRowClick?.(interviewId)
    // Allow natural navigation if not clicking on the highlight row
    if (highlightedId !== interviewId) {
      const baseUrl = exerciseId
        ? `/projects/${projectId}/personas/${personaId}/exercises/${exerciseId}/interviews/${interviewId}`
        : `/projects/${projectId}/personas/${personaId}/interviews/${interviewId}`
      window.location.href = baseUrl
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {initialInterviews.map((interview) => {
            const actions: ActionItem[] = [
              {
                id: 'delete',
                label: `Delete ${interview.title}`,
                icon: Trash2,
                variant: 'destructive',
                onClick: () => onDeleteClick?.(interview.id, interview.title),
              },
            ]

            return (
              <tr
                key={interview.id}
                onClick={(e) => handleRowClick(interview.id, e)}
                className={`border-b hover:bg-accent transition-colors cursor-pointer ${
                  highlightedId === interview.id ? 'action-button-energy' : ''
                } ${deletingId === interview.id ? 'row-collapse' : ''}`}
              >
                <td className="p-6">
                  <h3 className="font-semibold text-base mb-2">{interview.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{interview._count.annotations} annotations</span>
                    <span>{interview._count.analyses} analyses</span>
                    <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-6 text-right whitespace-nowrap">
                  <Badge variant={statusVariants[interview.status] || 'outline'}>
                    {interview.status}
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
