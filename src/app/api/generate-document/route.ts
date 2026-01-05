import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

const DOCUMENT_PROMPTS: Record<string, string> = {
  meeting_minutes: `You are a professional project manager. Generate meeting minutes from the following transcript.

Format the output as clean Markdown with these sections:
# Meeting Minutes: [Generate an appropriate title]

**Date:** [Extract from context or use "Meeting Date"]
**Attendees:** [List all speakers mentioned]

## Agenda
[List main topics discussed]

## Discussion Summary
[Summarize key points by topic]

## Decisions Made
[List any decisions that were made]

## Action Items
- [ ] [Action] - [Assignee] - [Due date if mentioned]

## Next Steps
[What happens next]

Transcript:
`,

  sprint_summary: `You are a professional project manager. Generate a sprint summary from the following information.

Format the output as clean Markdown:
# Sprint [Number] Summary

**Duration:** [Start Date] - [End Date]
**Status:** [Completed/Active]

## Completed Work
- [Task] - [Assignee]

## Incomplete Work
- [Task] - [Reason if known]

## Blockers Encountered
- [Description]

## Team Highlights
- [Achievements or milestones]

## Sprint Metrics
- Tasks Completed: X/Y (Z%)
- Velocity: [Story points or task count]

## Retrospective Notes
- What went well
- What could be improved

## Next Sprint Priorities
- [Priority items]

Sprint Data:
`,

  status_update: `You are a professional project manager. Generate a weekly status update from the following information.

Format the output as clean Markdown:
# Weekly Status Update

**Week of:** [Date]
**Project:** [Name]

## Summary
[Brief executive summary]

## Completed This Week
- [Item]

## In Progress
- [Item] - [Status/Percentage]

## Planned for Next Week
- [Item]

## Blockers & Risks
- [Issue] - [Mitigation]

## Key Metrics
- Sprint Progress: X%
- Tasks Completed: Y
- Team Velocity: Z

## Notes for Stakeholders
[Any important communications]

Data:
`,

  technical_doc: `You are a senior software engineer. Generate technical documentation from the following information.

Format the output as clean Markdown:
# [Feature/Component Name]

## Overview
[Brief description of what this is]

## Architecture
[High-level architecture description]

## API Reference
[Endpoints, methods, parameters]

## Data Models
[Relevant data structures]

## Usage Examples
\`\`\`
[Code examples]
\`\`\`

## Configuration
[Required configuration options]

## Dependencies
[External dependencies]

## Notes
[Additional technical notes]

Source Data:
`,
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, type, sourceData, title } = await req.json()

    if (!projectId || !type || !sourceData) {
      return NextResponse.json(
        { error: 'projectId, type, and sourceData are required' },
        { status: 400 }
      )
    }

    const prompt = DOCUMENT_PROMPTS[type]
    if (!prompt) {
      return NextResponse.json(
        { error: `Invalid document type: ${type}` },
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

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt + sourceData,
        },
      ],
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract title from content if not provided
    const generatedTitle = title || content.match(/^#\s+(.+)$/m)?.[1] || `${type.replace('_', ' ')} - ${new Date().toLocaleDateString()}`

    // Save document
    const document = await prisma.document.create({
      data: {
        projectId,
        type,
        title: generatedTitle,
        content,
        generatedFrom: 'AI generated',
      },
    })

    // Log AI usage
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const costUsd = (inputTokens * 0.003 + outputTokens * 0.015) / 1000

    await prisma.aIUsageLog.create({
      data: {
        projectId,
        feature: 'documentation',
        model: 'claude-sonnet-4',
        inputTokens,
        outputTokens,
        costUsd,
      },
    })

    return NextResponse.json({
      document,
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
    })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
}
