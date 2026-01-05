import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/costs - Get cost analytics for a project
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

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

    // Build date filter
    const dateFilter: { timestamp?: { gte?: Date; lte?: Date } } = {}
    if (startDate || endDate) {
      dateFilter.timestamp = {}
      if (startDate) dateFilter.timestamp.gte = new Date(startDate)
      if (endDate) dateFilter.timestamp.lte = new Date(endDate)
    }

    // Get all usage logs
    const usageLogs = await prisma.aIUsageLog.findMany({
      where: {
        projectId,
        ...dateFilter,
      },
      orderBy: { timestamp: 'desc' },
    })

    // Calculate totals
    const totalCost = usageLogs.reduce((sum, log) => sum + Number(log.costUsd), 0)
    const totalInputTokens = usageLogs.reduce((sum, log) => sum + log.inputTokens, 0)
    const totalOutputTokens = usageLogs.reduce((sum, log) => sum + log.outputTokens, 0)

    // Group by feature
    const byFeature = usageLogs.reduce((acc, log) => {
      const feature = log.feature
      if (!acc[feature]) {
        acc[feature] = { cost: 0, inputTokens: 0, outputTokens: 0, count: 0 }
      }
      acc[feature].cost += Number(log.costUsd)
      acc[feature].inputTokens += log.inputTokens
      acc[feature].outputTokens += log.outputTokens
      acc[feature].count += 1
      return acc
    }, {} as Record<string, { cost: number; inputTokens: number; outputTokens: number; count: number }>)

    // Group by model
    const byModel = usageLogs.reduce((acc, log) => {
      const model = log.model
      if (!acc[model]) {
        acc[model] = { cost: 0, inputTokens: 0, outputTokens: 0, count: 0 }
      }
      acc[model].cost += Number(log.costUsd)
      acc[model].inputTokens += log.inputTokens
      acc[model].outputTokens += log.outputTokens
      acc[model].count += 1
      return acc
    }, {} as Record<string, { cost: number; inputTokens: number; outputTokens: number; count: number }>)

    // Group by day for chart
    const byDay = usageLogs.reduce((acc, log) => {
      const day = log.timestamp.toISOString().split('T')[0]
      if (!acc[day]) {
        acc[day] = { cost: 0, count: 0 }
      }
      acc[day].cost += Number(log.costUsd)
      acc[day].count += 1
      return acc
    }, {} as Record<string, { cost: number; count: number }>)

    // Get recent logs (last 20)
    const recentLogs = usageLogs.slice(0, 20).map(log => ({
      id: log.id,
      feature: log.feature,
      model: log.model,
      inputTokens: log.inputTokens,
      outputTokens: log.outputTokens,
      costUsd: Number(log.costUsd),
      timestamp: log.timestamp,
    }))

    return NextResponse.json({
      summary: {
        totalCost,
        totalInputTokens,
        totalOutputTokens,
        totalCalls: usageLogs.length,
        averageCostPerCall: usageLogs.length > 0 ? totalCost / usageLogs.length : 0,
      },
      byFeature: Object.entries(byFeature).map(([feature, data]) => ({
        feature,
        ...data,
      })),
      byModel: Object.entries(byModel).map(([model, data]) => ({
        model,
        ...data,
      })),
      byDay: Object.entries(byDay)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      recentLogs,
    })
  } catch (error) {
    console.error('Error fetching costs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch costs' },
      { status: 500 }
    )
  }
}
