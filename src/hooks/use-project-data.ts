'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProjectStore } from '@/stores/project-store'

interface UseProjectDataOptions<T> {
  endpoint: string
  params?: Record<string, string>
  enabled?: boolean
}

interface UseProjectDataResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProjectData<T>({
  endpoint,
  params = {},
  enabled = true,
}: UseProjectDataOptions<T>): UseProjectDataResult<T> {
  const { currentProjectId } = useProjectStore()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!currentProjectId || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams({
        projectId: currentProjectId,
        ...params,
      })

      const response = await fetch(`${endpoint}?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [currentProjectId, endpoint, enabled, JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// Specific hooks for common data types

export interface Task {
  id: string
  title: string
  description: string
  status: string
  category: string | null
  priority: string | null
  assignee: {
    id: string
    canonicalName: string
  } | null
  sprint: {
    id: string
    sprintNumber: number
  } | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export function useTasks(params?: { status?: string; sprintId?: string }) {
  return useProjectData<{ tasks: Task[] }>({
    endpoint: '/api/tasks',
    params: params as Record<string, string>,
  })
}

export interface TeamMember {
  id: string
  canonicalName: string
  nameVariations: string[]
  role: string
  expertise: string[]
  active: boolean
  assignedTasks: number
  completedTasks: number
}

export function useTeamMembers() {
  return useProjectData<{ teamMembers: TeamMember[] }>({
    endpoint: '/api/team-members',
  })
}

export interface Sprint {
  id: string
  sprintNumber: number
  startDate: string
  endDate: string
  status: string
  goals: string[]
  painPoints: string[]
  metrics: {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    progress: number
  }
}

export function useSprints() {
  return useProjectData<{ sprints: Sprint[] }>({
    endpoint: '/api/sprints',
  })
}

export interface Document {
  id: string
  type: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function useDocuments(type?: string) {
  return useProjectData<{ documents: Document[] }>({
    endpoint: '/api/documents',
    params: type ? { type } : undefined,
  })
}

export interface CostSummary {
  summary: {
    totalCost: number
    totalInputTokens: number
    totalOutputTokens: number
    totalCalls: number
    averageCostPerCall: number
  }
  byFeature: Array<{
    feature: string
    cost: number
    inputTokens: number
    outputTokens: number
    count: number
  }>
  byModel: Array<{
    model: string
    cost: number
    count: number
  }>
  recentLogs: Array<{
    id: string
    feature: string
    model: string
    inputTokens: number
    outputTokens: number
    costUsd: number
    timestamp: string
  }>
}

export function useCosts(startDate?: string, endDate?: string) {
  return useProjectData<CostSummary>({
    endpoint: '/api/costs',
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  })
}
