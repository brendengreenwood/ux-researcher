'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeleteProjectDialog } from '@/components/delete-project-dialog'

interface ProjectDetailHeaderProps {
  projectId: string
  projectName: string
  projectDescription: string | null
}

export function ProjectDetailHeader({
  projectId,
  projectName,
  projectDescription,
}: ProjectDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
          {projectDescription && (
            <p className="text-muted-foreground">{projectDescription}</p>
          )}
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Project
        </Button>
      </div>
      <DeleteProjectDialog
        projectId={projectId}
        projectName={projectName}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
