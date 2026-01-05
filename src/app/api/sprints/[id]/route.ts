import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/sprints/[id] - Get a specific sprint
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

    const sprint = await prisma.sprint.findFirst({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
            name: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!sprint || sprint.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }

    // Calculate metrics
    const totalTasks = sprint.tasks.length
    const completedTasks = sprint.tasks.filter((t) => t.status === 'done').length
    const inProgressTasks = sprint.tasks.filter((t) => t.status === 'in_progress').length

    return NextResponse.json({
      sprint: {
        ...sprint,
        metrics: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching sprint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sprint' },
      { status: 500 }
    )
  }
}

// PATCH /api/sprints/[id] - Update a sprint
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
    const body = await req.json()

    // Verify ownership
    const existingSprint = await prisma.sprint.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingSprint || existingSprint.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }

    const sprint = await prisma.sprint.update({
      where: { id },
      data: {
        status: body.status,
        goals: body.goals,
        painPoints: body.painPoints,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
    })

    return NextResponse.json({ sprint })
  } catch (error) {
    console.error('Error updating sprint:', error)
    return NextResponse.json(
      { error: 'Failed to update sprint' },
      { status: 500 }
    )
  }
}

// DELETE /api/sprints/[id] - Delete a sprint
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
    const existingSprint = await prisma.sprint.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingSprint || existingSprint.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }

    await prisma.sprint.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sprint:', error)
    return NextResponse.json(
      { error: 'Failed to delete sprint' },
      { status: 500 }
    )
  }
}
