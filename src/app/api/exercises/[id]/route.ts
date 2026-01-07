import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: exerciseId } = await params

    await db.researchExercise.delete({
      where: { id: exerciseId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete exercise error:', error)
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    )
  }
}
