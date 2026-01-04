'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, MoreHorizontal, Copy, GripVertical } from 'lucide-react'

type TaskStatus = 'need_review' | 'backlog' | 'to_do' | 'in_progress' | 'done'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  category: 'frontend' | 'backend' | 'fullstack' | 'qa' | 'documentation'
  priority: 'high' | 'medium' | 'low'
  assignee: {
    name: string
    initials: string
  }
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Fix login button alignment',
    description: 'Mobile login button appears misaligned on smaller screens',
    status: 'in_progress',
    category: 'frontend',
    priority: 'medium',
    assignee: { name: 'Sasha', initials: 'SZ' },
  },
  {
    id: '2',
    title: 'Update API rate limiting',
    description: 'Increase rate limits for authenticated users',
    status: 'to_do',
    category: 'backend',
    priority: 'high',
    assignee: { name: 'Nick', initials: 'NR' },
  },
  {
    id: '3',
    title: 'Write unit tests for auth',
    description: 'Cover all authentication edge cases',
    status: 'done',
    category: 'qa',
    priority: 'medium',
    assignee: { name: 'Maria', initials: 'MK' },
  },
  {
    id: '4',
    title: 'Review PR #234',
    description: 'Review the new dashboard implementation',
    status: 'need_review',
    category: 'fullstack',
    priority: 'high',
    assignee: { name: 'Stuart', initials: 'SN' },
  },
  {
    id: '5',
    title: 'Database migration plan',
    description: 'Plan migration from PostgreSQL 14 to 16',
    status: 'backlog',
    category: 'backend',
    priority: 'low',
    assignee: { name: 'Nick', initials: 'NR' },
  },
  {
    id: '6',
    title: 'Implement dark mode',
    description: 'Add theme toggle and dark mode styles',
    status: 'to_do',
    category: 'frontend',
    priority: 'low',
    assignee: { name: 'Sasha', initials: 'SZ' },
  },
]

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'need_review', title: 'Need Review', color: 'bg-yellow-500' },
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-400' },
  { id: 'to_do', title: 'To Do', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-purple-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
]

function TaskCard({ task }: { task: Task }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  }

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-1">
            <GripVertical className="h-4 w-4 text-gray-300" />
            <Badge variant={task.category}>{task.category}</Badge>
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
        <p className="mb-3 text-xs text-gray-500 line-clamp-2">{task.description}</p>

        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BoardPage() {
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
        {columns.map((column) => {
          const columnTasks = mockTasks.filter((t) => t.status === column.id)

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
        })}
      </div>
    </div>
  )
}
