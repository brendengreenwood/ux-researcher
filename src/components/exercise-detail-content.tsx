'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InterviewsTable } from '@/components/interviews-table'
import { CreateInterviewDialog } from '@/components/create-interview-dialog'
import { DeleteInterviewDialog } from '@/components/delete-interview-dialog'

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

interface ExerciseDetailContentProps {
  projectId: string
  personaId: string
  exerciseId: string
  interviews: Interview[]
  statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>
}

export function ExerciseDetailContent({
  projectId,
  personaId,
  exerciseId,
  interviews: initialInterviews,
  statusVariants,
}: ExerciseDetailContentProps) {
  const [createInterviewOpen, setCreateInterviewOpen] = useState(false)
  const [deleteInterviewOpen, setDeleteInterviewOpen] = useState(false)
  const [deleteInterviewId, setDeleteInterviewId] = useState<string | null>(null)
  const [deleteInterviewTitle, setDeleteInterviewTitle] = useState<string | null>(null)
  const [deletingInterviewId, setDeletingInterviewId] = useState<string | null>(null)
  const [interviews, setInterviews] = useState(initialInterviews)
  const [highlightedInterviewId, setHighlightedInterviewId] = useState<string | null>(null)

  const handleInterviewCreated = (newInterview: any) => {
    const interviewWithCount: Interview = {
      ...newInterview,
      _count: newInterview._count || { annotations: 0, analyses: 0 }
    }
    setInterviews([interviewWithCount, ...interviews])
    setHighlightedInterviewId(newInterview.id)
  }

  const handleRowClick = (interviewId: string) => {
    if (highlightedInterviewId === interviewId) {
      setHighlightedInterviewId(null)
    }
  }

  const handleDeleteClick = (interviewId: string, interviewTitle: string) => {
    setDeleteInterviewId(interviewId)
    setDeleteInterviewTitle(interviewTitle)
    setDeleteInterviewOpen(true)
  }

  const handleInterviewDeleted = () => {
    if (deleteInterviewId && deleteInterviewTitle) {
      setDeletingInterviewId(deleteInterviewId)
      toast.success(`Deleted "${deleteInterviewTitle}"`)
      setTimeout(() => {
        setInterviews(interviews.filter(i => i.id !== deleteInterviewId))
        setDeletingInterviewId(null)
      }, 300)
    }
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Interviews</h2>

        {interviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No interviews recorded yet</p>
              <Button variant="action" onClick={() => setCreateInterviewOpen(true)}>
                Record your first interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Button variant="action" onClick={() => setCreateInterviewOpen(true)}>
              New Interview
            </Button>
            <InterviewsTable
              projectId={projectId}
              personaId={personaId}
              exerciseId={exerciseId}
              initialInterviews={interviews}
              statusVariants={statusVariants}
              highlightedId={highlightedInterviewId}
              deletingId={deletingInterviewId}
              onRowClick={handleRowClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        )}
      </div>
      <CreateInterviewDialog
        projectId={projectId}
        personaId={personaId}
        exerciseId={exerciseId}
        open={createInterviewOpen}
        onOpenChange={setCreateInterviewOpen}
        onSuccess={handleInterviewCreated}
      />
      {deleteInterviewId && deleteInterviewTitle && (
        <DeleteInterviewDialog
          projectId={projectId}
          personaId={personaId}
          interviewId={deleteInterviewId}
          interviewTitle={deleteInterviewTitle}
          open={deleteInterviewOpen}
          onOpenChange={setDeleteInterviewOpen}
          onSuccess={handleInterviewDeleted}
        />
      )}
    </>
  )
}
