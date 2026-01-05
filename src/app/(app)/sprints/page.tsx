'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, ChevronRight, CheckCircle2, Clock, Circle, FolderOpen, Calendar } from 'lucide-react'
import { useSprints } from '@/hooks/use-project-data'
import { useProjectStore } from '@/stores/project-store'

interface SprintGoal {
  text: string
  done: boolean
}

interface Sprint {
  id: string
  sprintNumber: number
  status: 'planned' | 'active' | 'completed'
  startDate: string
  endDate: string
  goals: SprintGoal[]
  metrics: {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    progress: number
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ActiveSprintSkeleton() {
  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SprintCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function SprintsPage() {
  const { currentProjectId } = useProjectStore()
  const { data: sprintsData, isLoading } = useSprints()

  const sprints = (sprintsData?.sprints || []) as Sprint[]
  const activeSprint = sprints.find((s) => s.status === 'active')
  const otherSprints = sprints.filter((s) => s.status !== 'active')

  if (!currentProjectId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-500 mb-4">Select or create a project to manage sprints</p>
        <p className="text-sm text-gray-400">Use the project selector in the header</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
          <p className="text-gray-500">Manage your 2-week development cycles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Sprint
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <>
          <ActiveSprintSkeleton />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SprintCardSkeleton />
            <SprintCardSkeleton />
            <SprintCardSkeleton />
          </div>
        </>
      ) : sprints.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No sprints yet</h3>
          <p className="text-gray-500 mb-4">Create your first sprint to start tracking work</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Sprint
          </Button>
        </div>
      ) : (
        <>
          {/* Active Sprint */}
          {activeSprint && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Sprint {activeSprint.sprintNumber}</CardTitle>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <CardDescription>
                      {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Progress */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {activeSprint.metrics.completedTasks} of {activeSprint.metrics.totalTasks} tasks
                      </span>
                    </div>
                    <Progress
                      value={activeSprint.metrics.progress}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {activeSprint.metrics.progress}% complete
                      </span>
                      <span>
                        {activeSprint.metrics.totalTasks - activeSprint.metrics.completedTasks} remaining
                      </span>
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Sprint Goals</h4>
                    {activeSprint.goals && activeSprint.goals.length > 0 ? (
                      <ul className="space-y-2">
                        {activeSprint.goals.map((goal, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            {goal.done ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-300" />
                            )}
                            <span className={goal.done ? 'text-gray-500 line-through' : 'text-gray-700'}>
                              {goal.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No goals defined</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sprint List */}
          {otherSprints.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherSprints.map((sprint) => (
                <Card key={sprint.id} className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Sprint {sprint.sprintNumber}</CardTitle>
                      <Badge
                        variant={sprint.status === 'completed' ? 'success' : 'secondary'}
                      >
                        {sprint.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sprint.status === 'completed' && sprint.metrics.totalTasks > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Completed</span>
                          <span className="font-medium">
                            {sprint.metrics.completedTasks}/{sprint.metrics.totalTasks}
                          </span>
                        </div>
                        <Progress
                          value={sprint.metrics.progress}
                          className="mt-2"
                        />
                      </div>
                    )}

                    {sprint.status === 'planned' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tasks planned</span>
                          <span className="font-medium">{sprint.metrics.totalTasks}</span>
                        </div>
                      </div>
                    )}

                    {sprint.goals && sprint.goals.length > 0 ? (
                      <ul className="space-y-1">
                        {sprint.goals.slice(0, 2).map((goal, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                            {goal.done ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-gray-400" />
                            )}
                            <span className="line-clamp-1">{goal.text}</span>
                          </li>
                        ))}
                        {sprint.goals.length > 2 && (
                          <li className="text-xs text-gray-400 pl-5">
                            +{sprint.goals.length - 2} more goals
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">No goals defined</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
