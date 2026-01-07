'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PersonasTable } from '@/components/personas-table'
import { CreatePersonaDialog } from '@/components/create-persona-dialog'
import { DeletePersonaDialog } from '@/components/delete-persona-dialog'

interface Persona {
  id: string
  name: string
  description: string | null
  characteristics: string | null
  _count: {
    interviews: number
  }
}

interface ProjectDetailContentProps {
  projectId: string
  personas: Persona[]
}

export function ProjectDetailContent({ projectId, personas: initialPersonas }: ProjectDetailContentProps) {
  const [createPersonaOpen, setCreatePersonaOpen] = useState(false)
  const [deletePersonaOpen, setDeletePersonaOpen] = useState(false)
  const [deletePersonaId, setDeletePersonaId] = useState<string | null>(null)
  const [deletePersonaName, setDeletePersonaName] = useState<string | null>(null)
  const [deletingPersonaId, setDeletingPersonaId] = useState<string | null>(null)
  const [personas, setPersonas] = useState(initialPersonas)
  const [highlightedPersonaId, setHighlightedPersonaId] = useState<string | null>(null)

  const handlePersonaCreated = (newPersona: any) => {
    const personaWithCount: Persona = {
      ...newPersona,
      _count: newPersona._count || { interviews: 0 }
    }
    setPersonas([personaWithCount, ...personas])
    setHighlightedPersonaId(newPersona.id)
  }

  const handleRowClick = (personaId: string) => {
    if (highlightedPersonaId === personaId) {
      setHighlightedPersonaId(null)
    }
  }

  const handleDeleteClick = (personaId: string, personaName: string) => {
    setDeletePersonaId(personaId)
    setDeletePersonaName(personaName)
    setDeletePersonaOpen(true)
  }

  const handlePersonaDeleted = () => {
    if (deletePersonaId && deletePersonaName) {
      setDeletingPersonaId(deletePersonaId)
      toast.success(`Deleted "${deletePersonaName}"`)
      setTimeout(() => {
        setPersonas(personas.filter(p => p.id !== deletePersonaId))
        setDeletingPersonaId(null)
      }, 300)
    }
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Personas</h2>

        {personas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No personas defined yet</p>
              <Button variant="action" onClick={() => setCreatePersonaOpen(true)}>
                Define your first persona
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Button variant="action" onClick={() => setCreatePersonaOpen(true)}>
              Add Persona
            </Button>
            <PersonasTable
              projectId={projectId}
              initialPersonas={personas}
              highlightedId={highlightedPersonaId}
              deletingId={deletingPersonaId}
              onRowClick={handleRowClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        )}
      </div>
      <CreatePersonaDialog
        projectId={projectId}
        open={createPersonaOpen}
        onOpenChange={setCreatePersonaOpen}
        onSuccess={handlePersonaCreated}
      />
      {deletePersonaId && deletePersonaName && (
        <DeletePersonaDialog
          projectId={projectId}
          personaId={deletePersonaId}
          personaName={deletePersonaName}
          open={deletePersonaOpen}
          onOpenChange={setDeletePersonaOpen}
          onSuccess={handlePersonaDeleted}
        />
      )}
    </>
  )
}
