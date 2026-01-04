import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/tasks - List all tasks for a project
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const sprintId = searchParams.get('sprintId')
    const assigneeId = searchParams.get('assigneeId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(status && { status }),
        ...(sprintId && { sprintId }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        assignee: true,
        sprint: true,
      },
      orderBy: [{ status: 'asc' }, { position: 'asc' }],
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create new task(s)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { projectId, tasks: tasksToCreate } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Handle single task or array of tasks
    const taskArray = Array.isArray(tasksToCreate) ? tasksToCreate : [body]

    const createdTasks = await prisma.$transaction(
      taskArray.map((task) =>
        prisma.task.create({
          data: {
            projectId,
            title: task.title,
            description: task.description || '',
            status: task.status || 'need_review',
            category: task.category,
            priority: task.priority,
            assigneeId: task.assigneeId,
            sprintId: task.sprintId,
            acceptanceCriteria: task.acceptanceCriteria || [],
            subtasks: task.subtasks || [],
            extractedFrom: task.extractedFrom,
          },
          include: {
            assignee: true,
          },
        })
      )
    )

    return NextResponse.json({ tasks: createdTasks }, { status: 201 })
  } catch (error) {
    console.error('Error creating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to create tasks' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks - Bulk update tasks (for board drag-drop)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { updates } = await req.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    const updatedTasks = await prisma.$transaction(
      updates.map((update: { id: string; status?: string; position?: number }) =>
        prisma.task.update({
          where: { id: update.id },
          data: {
            status: update.status,
            position: update.position,
          },
        })
      )
    )

    return NextResponse.json({ tasks: updatedTasks })
  } catch (error) {
    console.error('Error updating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to update tasks' },
      { status: 500 }
    )
  }
}
