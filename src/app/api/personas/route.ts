import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const persona = await db.persona.create({
    data: {
      projectId: body.projectId,
      name: body.name,
      description: body.description || null,
      characteristics: body.characteristics || null,
    },
  })

  return NextResponse.json(persona, { status: 201 })
}
