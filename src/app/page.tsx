import { db } from '@/lib/db'
import { DashboardWrapper } from '@/components/dashboard-wrapper'

export default async function Dashboard() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { personas: true }
      }
    }
  })

  return <DashboardWrapper projects={projects} />
}
