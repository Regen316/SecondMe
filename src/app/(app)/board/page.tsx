'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, MoreHorizontal, Copy, GripVertical, FolderOpen, KanbanSquare } from 'lucide-react'
import { useTasks } from '@/hooks/use-project-data'
import { useProjectStore } from '@/stores/project-store'

type TaskStatus = 'need_review' | 'backlog' | 'to_do' | 'in_progress' | 'done'

interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  category: 'frontend' | 'backend' | 'full_stack' | 'qa' | 'documentation' | null
  priority: 'high' | 'medium' | 'low'
  assignee: {
    canonicalName: string
  } | null
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'need_review', title: 'Need Review', color: 'bg-yellow-500' },
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-400' },
  { id: 'to_do', title: 'To Do', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-purple-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TaskCard({ task }: { task: Task }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  }

  const categoryVariant = task.category === 'full_stack' ? 'fullstack' : task.category

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-1">
            <GripVertical className="h-4 w-4 text-gray-300" />
            {task.category && (
              <Badge variant={categoryVariant as 'frontend' | 'backend' | 'fullstack' | 'qa' | 'documentation'}>
                {task.category.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <h4 className="mb-1 text-sm font-medium text-gray-900">{task.title}</h4>
        {task.description && (
          <p className="mb-3 text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                {getInitials(task.assignee.canonicalName)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TaskCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-3 h-3 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function ColumnSkeleton() {
  return (
    <div className="w-72 flex-shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}

export default function BoardPage() {
  const { currentProjectId } = useProjectStore()
  const { data: tasksData, isLoading } = useTasks()

  const tasks = (tasksData?.tasks || []) as Task[]

  if (!currentProjectId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-500 mb-4">Select or create a project to view your task board</p>
        <p className="text-sm text-gray-400">Use the project selector in the header</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-gray-500">Manage and track your project tasks</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {isLoading ? (
          <>
            <ColumnSkeleton />
            <ColumnSkeleton />
            <ColumnSkeleton />
            <ColumnSkeleton />
            <ColumnSkeleton />
          </>
        ) : (
          columns.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id)

            return (
              <div key={column.id} className="w-72 flex-shrink-0">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${column.color}`} />
                        <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {columnTasks.length}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
                        No tasks
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })
        )}
      </div>

      {/* Empty State */}
      {!isLoading && tasks.length === 0 && (
        <div className="text-center py-8">
          <KanbanSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Ingest a meeting transcript to extract tasks</p>
          <Button asChild>
            <a href="/ingest">Ingest Meeting</a>
          </Button>
        </div>
      )}
    </div>
  )
}
