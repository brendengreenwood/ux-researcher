'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeletePersonaDialog } from '@/components/delete-persona-dialog'

interface PersonaDetailHeaderProps {
  projectId: string
  personaId: string
  personaName: string
  personaDescription: string | null
}

export function PersonaDetailHeader({
  projectId,
  personaId,
  personaName,
  personaDescription,
}: PersonaDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{personaName}</h1>
          {personaDescription && (
            <p className="text-muted-foreground">{personaDescription}</p>
          )}
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Persona
        </Button>
      </div>
      <DeletePersonaDialog
        projectId={projectId}
        personaId={personaId}
        personaName={personaName}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
