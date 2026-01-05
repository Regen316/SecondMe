import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/team-members - List all team members for a project
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

    const teamMembers = await prisma.teamMember.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            assignedTasks: true,
          },
        },
      },
      orderBy: { canonicalName: 'asc' },
    })

    // Get completed task count for each member
    const membersWithStats = await Promise.all(
      teamMembers.map(async (member) => {
        const completedTasks = await prisma.task.count({
          where: {
            assigneeId: member.id,
            status: 'done',
          },
        })

        return {
          ...member,
          assignedTasks: member._count.assignedTasks,
          completedTasks,
          _count: undefined,
        }
      })
    )

    return NextResponse.json({ teamMembers: membersWithStats })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST /api/team-members - Create a new team member
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, canonicalName, nameVariations, role, expertise } = await req.json()

    if (!projectId || !canonicalName) {
      return NextResponse.json(
        { error: 'projectId and canonicalName are required' },
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

    const teamMember = await prisma.teamMember.create({
      data: {
        projectId,
        canonicalName,
        nameVariations: nameVariations || [],
        role: role || 'Team Member',
        expertise: expertise || [],
      },
    })

    return NextResponse.json({ teamMember }, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}

// PATCH /api/team-members - Update a team member
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, canonicalName, nameVariations, role, expertise, active } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership through project
    const existingMember = await prisma.teamMember.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingMember || existingMember.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        canonicalName,
        nameVariations,
        role,
        expertise,
        active,
      },
    })

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE /api/team-members - Delete a team member
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership through project
    const existingMember = await prisma.teamMember.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!existingMember || existingMember.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
