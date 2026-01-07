import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const exercise = await db.researchExercise.create({
    data: {
      personaId: body.personaId,
      name: body.name,
      description: body.description || null,
      type: body.type,
    },
    include: {
      _count: {
        select: { interviews: true }
      }
    }
  })

  return NextResponse.json(exercise, { status: 201 })
}
