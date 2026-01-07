import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    console.log('Attempting to delete project:', projectId)

    const result = await db.project.delete({
      where: { id: projectId }
    })

    console.log('Successfully deleted project:', result)

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Delete project error:', errorMessage)
    return NextResponse.json(
      { error: `Failed to delete project: ${errorMessage}` },
      { status: 500 }
    )
  }
}
