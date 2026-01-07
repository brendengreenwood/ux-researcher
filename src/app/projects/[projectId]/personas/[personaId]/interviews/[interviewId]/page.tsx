import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { InterviewDetailHeader } from '@/components/interview-detail-header'

interface Props {
  params: { projectId: string; personaId: string; interviewId: string }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
            <BreadcrumbLink href={`/projects/${params.projectId}/personas/${params.personaId}/exercises/${interview.exerciseId}`}>
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

      <div className="grid gap-6">
        {interview.audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <audio controls src={interview.audioUrl} className="w-full" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Annotations</CardTitle>
            <CardDescription>{interview.annotations.length} notes</CardDescription>
          </CardHeader>
          <CardContent>
            {interview.annotations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No annotations for this interview
              </p>
            ) : (
              <div className="space-y-3">
                {interview.annotations.map((annotation) => (
                  <div key={annotation.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge variant="outline" className="shrink-0 font-mono">
                      {formatTime(annotation.timestamp)}
                    </Badge>
                    <p className="flex-1 text-sm">{annotation.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transcript</CardTitle>
              {!interview.transcript && interview.audioUrl && (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {interview.transcript ? (
              <p className="text-sm whitespace-pre-wrap">{interview.transcript.content}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  {interview.audioUrl ? 'Transcript not yet generated' : 'No audio recording to transcribe'}
                </p>
                {interview.audioUrl && (
                  <p className="text-sm text-muted-foreground">
                    Transcription will be available after processing
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>Insights from AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            {interview.analyses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No analysis available yet</p>
                <p className="text-sm text-muted-foreground">
                  AI analysis will run after transcription is complete
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {interview.analyses.map((analysis) => {
                  const content = JSON.parse(analysis.content)
                  return (
                    <div key={analysis.id} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>{analysis.agentName}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(content, null, 2)}
                      </pre>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
