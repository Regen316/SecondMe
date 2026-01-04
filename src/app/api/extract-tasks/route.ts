import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic()

const TASK_EXTRACTION_PROMPT = `You are a project management assistant. Analyze the following meeting transcript and extract all actionable tasks, bugs, and feature requests.

For each task, provide:
1. Task title (concise, action-oriented)
2. Description (context from meeting)
3. Suggested assignee (if mentioned, use exact name from transcript)
4. Category: "frontend" | "backend" | "full_stack" | "qa" | "documentation"
5. Priority: "high" | "medium" | "low" (based on context, default to "medium")

Return ONLY a valid JSON array with no additional text:
[
  {
    "title": "Fix login button alignment",
    "description": "The login button on mobile appears misaligned. Mentioned by Sarah.",
    "assignee": "Nick",
    "category": "frontend",
    "priority": "medium"
  }
]

If no actionable tasks are found, return an empty array: []

Meeting Transcript:
`

interface ExtractedTask {
  title: string
  description: string
  assignee?: string
  category?: string
  priority?: string
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transcript, projectId } = await req.json()

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }

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
      include: {
        teamMembers: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Call Claude API to extract tasks
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: TASK_EXTRACTION_PROMPT + transcript,
        },
      ],
    })

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let extractedTasks: ExtractedTask[] = []
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        extractedTasks = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Match assignees to team members
    const tasksWithAssignees = extractedTasks.map((task) => {
      let matchedAssignee = null

      if (task.assignee) {
        // Find team member by name or variation
        matchedAssignee = project.teamMembers.find((member) => {
          const nameLower = task.assignee!.toLowerCase()
          return (
            member.canonicalName.toLowerCase().includes(nameLower) ||
            member.nameVariations.some((v) => v.toLowerCase() === nameLower)
          )
        })
      }

      return {
        ...task,
        assigneeId: matchedAssignee?.id || null,
        assigneeName: matchedAssignee?.canonicalName || task.assignee || null,
      }
    })

    // Log AI usage
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const costUsd = (inputTokens * 0.003 + outputTokens * 0.015) / 1000 // Claude Sonnet pricing

    await prisma.aIUsageLog.create({
      data: {
        projectId,
        feature: 'task_extraction',
        model: 'claude-sonnet-4',
        inputTokens,
        outputTokens,
        costUsd,
      },
    })

    return NextResponse.json({
      tasks: tasksWithAssignees,
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
    })
  } catch (error) {
    console.error('Error extracting tasks:', error)
    return NextResponse.json(
      { error: 'Failed to extract tasks' },
      { status: 500 }
    )
  }
}
