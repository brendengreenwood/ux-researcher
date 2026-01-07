'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardContent } from '@/components/dashboard-content'
import { CreateProjectDialog } from '@/components/create-project-dialog'

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: Date
  _count: {
    personas: number
  }
}

interface DashboardWrapperProps {
  projects: Project[]
}

export function DashboardWrapper({ projects: initialProjects }: DashboardWrapperProps) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [projects, setProjects] = useState(initialProjects)

  const handleProjectCreated = (newProject: any) => {
    const projectWithCount: Project = {
      ...newProject,
      _count: newProject._count || { personas: 0 }
    }
    setProjects([projectWithCount, ...projects])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage your UX research projects
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button variant="action" onClick={() => setCreateProjectOpen(true)}>
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DashboardContent projects={projects} />
      )}

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}
