'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTasks, useSprints, useTeamMembers, useDocuments } from '@/hooks/use-project-data'
import { useProjectStore } from '@/stores/project-store'
import {
  KanbanSquare,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
} from 'lucide-react'
import Link from 'next/link'

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

function TaskItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div>
          <Skeleton className="h-4 w-40 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  )
}

export default function DashboardPage() {
  const { currentProjectId } = useProjectStore()
  const { data: tasksData, isLoading: tasksLoading } = useTasks()
  const { data: sprintsData, isLoading: sprintsLoading } = useSprints()
  const { data: teamData, isLoading: teamLoading } = useTeamMembers()
  const { data: docsData, isLoading: docsLoading } = useDocuments()

  const tasks = tasksData?.tasks || []
  const sprints = sprintsData?.sprints || []
  const teamMembers = teamData?.teamMembers || []
  const documents = docsData?.documents || []

  const activeSprint = sprints.find((s) => s.status === 'active')
  const activeTasks = tasks.filter((t) => t.status !== 'done')
  const recentTasks = tasks.slice(0, 5)

  if (!currentProjectId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-500 mb-4">Select or create a project to get started</p>
        <p className="text-sm text-gray-400">Use the project selector in the header</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s your project overview.</p>
        </div>
        <Button asChild>
          <Link href="/ingest">
            Ingest New Meeting
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tasksLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <KanbanSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTasks.length}</div>
              <p className="text-xs text-gray-500">{tasks.length} total</p>
            </CardContent>
          </Card>
        )}

        {sprintsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeSprint ? `${activeSprint.metrics.progress}%` : 'N/A'}
              </div>
              <Progress value={activeSprint?.metrics.progress || 0} className="mt-2" />
            </CardContent>
          </Card>
        )}

        {teamLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-gray-500">
                {teamMembers.filter((m) => m.active).length} active
              </p>
            </CardContent>
          </Card>
        )}

        {docsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-gray-500">Generated docs</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Tasks extracted from your latest meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksLoading ? (
                <>
                  <TaskItemSkeleton />
                  <TaskItemSkeleton />
                  <TaskItemSkeleton />
                </>
              ) : recentTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <KanbanSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No tasks yet</p>
                  <p className="text-sm">Ingest a meeting to extract tasks</p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'done' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : task.status === 'need_review' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {task.assignee
                            ? `Assigned to ${task.assignee.canonicalName}`
                            : 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    {task.category && (
                      <Badge
                        variant={
                          (task.category === 'full_stack'
                            ? 'fullstack'
                            : task.category) as
                            | 'frontend'
                            | 'backend'
                            | 'fullstack'
                            | 'qa'
                            | 'documentation'
                        }
                      >
                        {task.category.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/board">View All Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Current Sprint */}
        <Card>
          <CardHeader>
            {activeSprint ? (
              <>
                <CardTitle>Sprint {activeSprint.sprintNumber}</CardTitle>
                <CardDescription>
                  {new Date(activeSprint.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(activeSprint.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle>No Active Sprint</CardTitle>
                <CardDescription>Create a sprint to track progress</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {sprintsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : activeSprint ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium">
                    {activeSprint.metrics.completedTasks} of {activeSprint.metrics.totalTasks} tasks
                  </span>
                </div>
                <Progress value={activeSprint.metrics.progress} />

                {activeSprint.goals.length > 0 && (
                  <div className="pt-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Sprint Goals</h4>
                    <ul className="space-y-2 text-sm">
                      {activeSprint.goals.map((goal, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                          <span className="text-gray-600">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No active sprint</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/sprints">Create Sprint</Link>
                </Button>
              </div>
            )}
            {activeSprint && (
              <Button variant="ghost" className="mt-4 w-full" asChild>
                <Link href="/sprints">View Sprint Details</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you get things done</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/ingest">
                <FileText className="h-6 w-6" />
                <span>Ingest Meeting</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/board">
                <KanbanSquare className="h-6 w-6" />
                <span>View Board</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/documents">
                <FileText className="h-6 w-6" />
                <span>Generate Document</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/team">
                <Users className="h-6 w-6" />
                <span>Manage Team</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
