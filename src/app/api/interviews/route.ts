import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const personaId = formData.get('personaId') as string
  const exerciseId = formData.get('exerciseId') as string
  const title = formData.get('title') as string
  const audioFile = formData.get('audio') as File | null
  const annotationsJson = formData.get('annotations') as string

  let audioUrl: string | null = null

  // Save audio file if provided
  if (audioFile && audioFile.size > 0) {
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const filename = `${Date.now()}-${audioFile.name}`
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    audioUrl = `/uploads/${filename}`
  }

  // Create interview record
  const interview = await db.interview.create({
    data: {
      personaId,
      exerciseId,
      title,
      audioUrl,
      status: 'recorded',
    },
  })

  // Create annotations if provided
  if (annotationsJson) {
    const annotations = JSON.parse(annotationsJson) as Array<{ timestamp: number; content: string }>

    if (annotations.length > 0) {
      await db.annotation.createMany({
        data: annotations.map(a => ({
          interviewId: interview.id,
          timestamp: a.timestamp,
          content: a.content,
        })),
      })
    }
  }

  return NextResponse.json(interview, { status: 201 })
}
