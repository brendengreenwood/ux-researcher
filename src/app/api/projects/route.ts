import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { personas: true }
      }
    }
  })
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const project = await db.project.create({
    data: {
      name: body.name,
      description: body.description || null,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
