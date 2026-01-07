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
import { ProjectDetailContent } from '@/components/project-detail-content'
import { ProjectDetailHeader } from '@/components/project-detail-header'

interface Props {
  params: { projectId: string }
}

export default async function ProjectDetail({ params }: Props) {
  const project = await db.project.findUnique({
    where: { id: params.projectId },
    include: {
      personas: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { interviews: true }
          }
        }
      }
    }
  })

  if (!project) {
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
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProjectDetailHeader projectId={project.id} projectName={project.name} projectDescription={project.description} />

      <ProjectDetailContent projectId={project.id} personas={project.personas} />
    </div>
  )
}
