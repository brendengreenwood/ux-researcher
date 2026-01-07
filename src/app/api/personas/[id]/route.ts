import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personaId } = await params

    await db.persona.delete({
      where: { id: personaId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete persona error:', error)
    return NextResponse.json(
      { error: 'Failed to delete persona' },
      { status: 500 }
    )
  }
}
