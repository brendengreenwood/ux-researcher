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
import { ExerciseDetailHeader } from '@/components/exercise-detail-header'
import { ExerciseDetailContent } from '@/components/exercise-detail-content'

interface Props {
  params: { projectId: string; personaId: string; exerciseId: string }
}

export default async function ExerciseDetail({ params }: Props) {
  const exercise = await db.researchExercise.findUnique({
    where: { id: params.exerciseId },
    include: {
      persona: { include: { project: true } },
      interviews: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { annotations: true, analyses: true }
          }
        }
      }
    }
  })

  if (!exercise) {
    notFound()
  }

  const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    recorded: 'secondary',
    transcribing: 'secondary',
    analyzing: 'secondary',
    complete: 'default',
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
            <BreadcrumbLink href={`/projects/${params.projectId}`}>
              {exercise.persona.project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${params.projectId}/personas/${params.personaId}`}>
              {exercise.persona.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{exercise.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ExerciseDetailHeader
        projectId={params.projectId}
        personaId={params.personaId}
        exerciseId={exercise.id}
        exerciseName={exercise.name}
        exerciseDescription={exercise.description}
        exerciseType={exercise.type}
      />

      {exercise.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {exercise.description}
            </p>
          </CardContent>
        </Card>
      )}

      <ExerciseDetailContent
        projectId={params.projectId}
        personaId={params.personaId}
        exerciseId={exercise.id}
        interviews={exercise.interviews}
        statusVariants={statusVariants}
      />
    </div>
  )
}
