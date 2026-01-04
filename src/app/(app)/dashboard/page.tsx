import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  KanbanSquare,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <KanbanSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <Progress value={67} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">3 created this week</p>
          </CardContent>
        </Card>
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
              {[
                { title: 'Fix login button alignment', status: 'in_progress', category: 'frontend', assignee: 'Sasha' },
                { title: 'Update API rate limiting', status: 'to_do', category: 'backend', assignee: 'Nick' },
                { title: 'Write unit tests for auth', status: 'done', category: 'qa', assignee: 'Maria' },
                { title: 'Review PR #234', status: 'need_review', category: 'fullstack', assignee: 'You' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
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
                      <p className="text-xs text-gray-500">Assigned to {task.assignee}</p>
                    </div>
                  </div>
                  <Badge variant={task.category as 'frontend' | 'backend' | 'fullstack' | 'qa'}>
                    {task.category}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/board">View All Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Current Sprint */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint 23</CardTitle>
            <CardDescription>Jan 6 - Jan 17, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completed</span>
                <span className="font-medium">12 of 18 tasks</span>
              </div>
              <Progress value={67} />

              <div className="pt-4">
                <h4 className="mb-3 text-sm font-medium text-gray-700">Sprint Goals</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Complete user authentication flow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Implement dashboard analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-600">Deploy to staging environment</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/sprints">View Sprint Details</Link>
            </Button>
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
