import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/tasks/[id] - Get a specific task
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

    const task = await prisma.task.findFirst({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
            name: true,
          },
        },
        assignee: true,
        sprint: true,
      },
    })

    if (!task || task.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update a task
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
    const existingTask = await prisma.task.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingTask || existingTask.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Handle completion status
    const completedAt =
      body.status === 'done' && existingTask.status !== 'done'
        ? new Date()
        : body.status !== 'done'
        ? null
        : existingTask.completedAt

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        category: body.category,
        priority: body.priority,
        assigneeId: body.assigneeId,
        sprintId: body.sprintId,
        position: body.position,
        acceptanceCriteria: body.acceptanceCriteria,
        subtasks: body.subtasks,
        dependencies: body.dependencies,
        completedAt,
      },
      include: {
        assignee: true,
        sprint: true,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
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
    const existingTask = await prisma.task.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingTask || existingTask.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
