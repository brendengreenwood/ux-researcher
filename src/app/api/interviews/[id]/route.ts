import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params

    await db.interview.delete({
      where: { id: interviewId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete interview error:', error)
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    )
  }
}
