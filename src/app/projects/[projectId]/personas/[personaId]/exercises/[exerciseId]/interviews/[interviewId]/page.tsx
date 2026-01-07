import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { InterviewDetailHeader } from '@/components/interview-detail-header'
import { InterviewDetailView } from '@/components/interview-detail-view'

interface Props {
  params: { projectId: string; personaId: string; exerciseId: string; interviewId: string }
}

export default async function InterviewDetail({ params }: Props) {
  const interview = await db.interview.findUnique({
    where: { id: params.interviewId },
    include: {
      persona: { include: { project: true } },
      exercise: true,
      annotations: { orderBy: { timestamp: 'asc' } },
      transcript: true,
      analyses: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!interview) notFound()

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
              {interview.persona.project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${params.projectId}/personas/${params.personaId}`}>
              {interview.persona.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${params.projectId}/personas/${params.personaId}/exercises/${params.exerciseId}`}>
              {interview.exercise.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{interview.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <InterviewDetailHeader
        projectId={params.projectId}
        personaId={params.personaId}
        interviewId={interview.id}
        interviewTitle={interview.title}
        interviewStatus={interview.status}
        interviewCreatedAt={interview.createdAt}
        statusVariants={statusVariants}
      />

      <InterviewDetailView
        title={interview.title}
        audioUrl={interview.audioUrl}
        annotations={interview.annotations}
        transcript={interview.transcript}
        analyses={interview.analyses}
      />
    </div>
  )
}
