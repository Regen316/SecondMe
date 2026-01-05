import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/documents/[id] - Get a specific document
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const document = await prisma.document.findFirst({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
            name: true,
          },
        },
      },
    })

    if (!document || document.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/[id] - Update a document
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { title, content } = await req.json()

    // Verify ownership
    const existingDoc = await prisma.document.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingDoc || existingDoc.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        title,
        content,
      },
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existingDoc = await prisma.document.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingDoc || existingDoc.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
