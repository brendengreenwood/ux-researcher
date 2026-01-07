import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PersonaDetailContent } from '@/components/persona-detail-content'
import { PersonaDetailHeader } from '@/components/persona-detail-header'

interface Props {
  params: { projectId: string; personaId: string }
}

export default async function PersonaDetail({ params }: Props) {
  const persona = await db.persona.findUnique({
    where: { id: params.personaId },
    include: {
      project: true,
      exercises: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { interviews: true }
          }
        }
      }
    }
  })

  if (!persona) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${persona.projectId}`}>
              {persona.project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{persona.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PersonaDetailHeader
        projectId={persona.projectId}
        personaId={persona.id}
        personaName={persona.name}
        personaDescription={persona.description}
      />

      {persona.characteristics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {persona.characteristics}
            </p>
          </CardContent>
        </Card>
      )}

      <PersonaDetailContent
        projectId={persona.projectId}
        personaId={persona.id}
        exercises={persona.exercises}
      />
    </div>
  )
}
