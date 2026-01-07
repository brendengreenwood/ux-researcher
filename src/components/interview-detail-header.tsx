'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteInterviewDialog } from '@/components/delete-interview-dialog'

interface InterviewDetailHeaderProps {
  projectId: string
  personaId: string
  interviewId: string
  interviewTitle: string
  interviewStatus: string
  interviewCreatedAt: Date
  statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>
}

export function InterviewDetailHeader({
  projectId,
  personaId,
  interviewId,
  interviewTitle,
  interviewStatus,
  interviewCreatedAt,
  statusVariants,
}: InterviewDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{interviewTitle}</h1>
          <p className="text-muted-foreground">
            Recorded {new Date(interviewCreatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[interviewStatus] || 'outline'}>
            {interviewStatus}
          </Badge>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Interview
          </Button>
        </div>
      </div>
      <DeleteInterviewDialog
        projectId={projectId}
        personaId={personaId}
        interviewId={interviewId}
        interviewTitle={interviewTitle}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
