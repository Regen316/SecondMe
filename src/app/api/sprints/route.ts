import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/sprints - List all sprints for a project
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

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

    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { sprintNumber: 'desc' },
    })

    // Calculate metrics for each sprint
    const sprintsWithMetrics = sprints.map((sprint) => {
      const totalTasks = sprint.tasks.length
      const completedTasks = sprint.tasks.filter((t) => t.status === 'done').length
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      return {
        ...sprint,
        tasks: undefined,
        metrics: {
          totalTasks,
          completedTasks,
          inProgressTasks: sprint.tasks.filter((t) => t.status === 'in_progress').length,
          progress: Math.round(progress),
        },
      }
    })

    return NextResponse.json({ sprints: sprintsWithMetrics })
  } catch (error) {
    console.error('Error fetching sprints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    )
  }
}

// POST /api/sprints - Create a new sprint
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, sprintNumber, startDate, endDate, goals } = await req.json()

    if (!projectId || !sprintNumber || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'projectId, sprintNumber, startDate, and endDate are required' },
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

    // Check for duplicate sprint number
    const existingSprint = await prisma.sprint.findFirst({
      where: {
        projectId,
        sprintNumber,
      },
    })

    if (existingSprint) {
      return NextResponse.json(
        { error: `Sprint ${sprintNumber} already exists` },
        { status: 400 }
      )
    }

    const sprint = await prisma.sprint.create({
      data: {
        projectId,
        sprintNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        goals: goals || [],
        status: 'planned',
      },
    })

    return NextResponse.json({ sprint }, { status: 201 })
  } catch (error) {
    console.error('Error creating sprint:', error)
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    )
  }
}
