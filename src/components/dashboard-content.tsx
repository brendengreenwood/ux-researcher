'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ProjectsTable } from '@/components/projects-table'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { DeleteProjectDialog } from '@/components/delete-project-dialog'

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: Date
  _count: {
    personas: number
  }
}

interface DashboardContentProps {
  projects: Project[]
}

export function DashboardContent({ projects: initialProjects }: DashboardContentProps) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [deleteProjectName, setDeleteProjectName] = useState<string | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState(initialProjects)
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null)

  const handleProjectCreated = (newProject: any) => {
    const projectWithCount: Project = {
      ...newProject,
      _count: newProject._count || { personas: 0 }
    }
    setProjects([projectWithCount, ...projects])
    setHighlightedProjectId(newProject.id)
  }

  const handleRowClick = (projectId: string) => {
    if (highlightedProjectId === projectId) {
      setHighlightedProjectId(null)
    }
  }

  const handleDeleteClick = (projectId: string, projectName: string) => {
    setDeleteProjectId(projectId)
    setDeleteProjectName(projectName)
    setDeleteProjectOpen(true)
  }

  const handleProjectDeleted = () => {
    if (deleteProjectId && deleteProjectName) {
      setDeletingProjectId(deleteProjectId)
      toast.success(`Deleted "${deleteProjectName}"`)
      setTimeout(() => {
        setProjects(projects.filter(p => p.id !== deleteProjectId))
        setDeletingProjectId(null)
      }, 300)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Button variant="action" onClick={() => setCreateProjectOpen(true)}>
          New Project
        </Button>
        <ProjectsTable
          initialProjects={projects}
          highlightedId={highlightedProjectId}
          deletingId={deletingProjectId}
          onRowClick={handleRowClick}
          onDeleteClick={handleDeleteClick}
        />
      </div>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onSuccess={handleProjectCreated}
      />
      {deleteProjectId && deleteProjectName && (
        <DeleteProjectDialog
          projectId={deleteProjectId}
          projectName={deleteProjectName}
          open={deleteProjectOpen}
          onOpenChange={setDeleteProjectOpen}
          onSuccess={handleProjectDeleted}
        />
      )}
    </>
  )
}
