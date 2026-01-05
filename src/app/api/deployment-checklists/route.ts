import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/deployment-checklists - List all checklists for a project
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

    const checklists = await prisma.deploymentChecklist.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ checklists })
  } catch (error) {
    console.error('Error fetching checklists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checklists' },
      { status: 500 }
    )
  }
}

// POST /api/deployment-checklists - Create a new checklist
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, featureName, taskIds, notes } = await req.json()

    if (!projectId || !featureName) {
      return NextResponse.json(
        { error: 'projectId and featureName are required' },
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

    const checklist = await prisma.deploymentChecklist.create({
      data: {
        projectId,
        featureName,
        taskIds: taskIds || [],
        notes,
      },
    })

    return NextResponse.json({ checklist }, { status: 201 })
  } catch (error) {
    console.error('Error creating checklist:', error)
    return NextResponse.json(
      { error: 'Failed to create checklist' },
      { status: 500 }
    )
  }
}

// PATCH /api/deployment-checklists - Update deployment status
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      id,
      environment, // 'dev' | 'staging' | 'prod'
      deployed,
      deployedBy,
      notes
    } = await req.json()

    if (!id || !environment) {
      return NextResponse.json(
        { error: 'id and environment are required' },
        { status: 400 }
      )
    }

    // Verify ownership through project
    const existingChecklist = await prisma.deploymentChecklist.findFirst({
      where: { id },
    })

    if (!existingChecklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 })
    }

    // Build update data based on environment
    const updateData: Record<string, unknown> = {}
    const now = new Date()

    switch (environment) {
      case 'dev':
        updateData.devDeployed = deployed
        updateData.devDeployedAt = deployed ? now : null
        updateData.devDeployedBy = deployed ? deployedBy : null
        break
      case 'staging':
        updateData.stagingDeployed = deployed
        updateData.stagingDeployedAt = deployed ? now : null
        updateData.stagingDeployedBy = deployed ? deployedBy : null
        break
      case 'prod':
        updateData.prodDeployed = deployed
        updateData.prodDeployedAt = deployed ? now : null
        updateData.prodDeployedBy = deployed ? deployedBy : null
        break
      default:
        return NextResponse.json(
          { error: 'Invalid environment. Use dev, staging, or prod' },
          { status: 400 }
        )
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const checklist = await prisma.deploymentChecklist.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ checklist })
  } catch (error) {
    console.error('Error updating checklist:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist' },
      { status: 500 }
    )
  }
}

// DELETE /api/deployment-checklists - Delete a checklist
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
        { error: 'Checklist ID is required' },
        { status: 400 }
      )
    }

    await prisma.deploymentChecklist.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting checklist:', error)
    return NextResponse.json(
      { error: 'Failed to delete checklist' },
      { status: 500 }
    )
  }
}
