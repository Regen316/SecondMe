import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react'

const sprints = [
  {
    id: 1,
    number: 23,
    status: 'active',
    startDate: 'Jan 6, 2026',
    endDate: 'Jan 17, 2026',
    totalTasks: 18,
    completedTasks: 12,
    goals: [
      { text: 'Complete user authentication flow', done: true },
      { text: 'Implement dashboard analytics', done: false },
      { text: 'Deploy to staging environment', done: false },
    ],
  },
  {
    id: 2,
    number: 22,
    status: 'completed',
    startDate: 'Dec 23, 2025',
    endDate: 'Jan 3, 2026',
    totalTasks: 15,
    completedTasks: 14,
    goals: [
      { text: 'Set up project infrastructure', done: true },
      { text: 'Create database models', done: true },
      { text: 'Design system components', done: true },
    ],
  },
  {
    id: 3,
    number: 24,
    status: 'planned',
    startDate: 'Jan 20, 2026',
    endDate: 'Jan 31, 2026',
    totalTasks: 0,
    completedTasks: 0,
    goals: [
      { text: 'Mobile responsiveness', done: false },
      { text: 'Performance optimization', done: false },
    ],
  },
]

export default function SprintsPage() {
  const activeSprint = sprints.find((s) => s.status === 'active')

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

      {/* Active Sprint */}
      {activeSprint && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Sprint {activeSprint.number}</CardTitle>
                  <Badge variant="default">Active</Badge>
                </div>
                <CardDescription>
                  {activeSprint.startDate} - {activeSprint.endDate}
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
                    {activeSprint.completedTasks} of {activeSprint.totalTasks} tasks
                  </span>
                </div>
                <Progress
                  value={(activeSprint.completedTasks / activeSprint.totalTasks) * 100}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {Math.round((activeSprint.completedTasks / activeSprint.totalTasks) * 100)}%
                    complete
                  </span>
                  <span>{activeSprint.totalTasks - activeSprint.completedTasks} remaining</span>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700">Sprint Goals</h4>
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
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sprint List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sprints
          .filter((s) => s.status !== 'active')
          .map((sprint) => (
            <Card key={sprint.id} className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Sprint {sprint.number}</CardTitle>
                  <Badge
                    variant={sprint.status === 'completed' ? 'success' : 'secondary'}
                  >
                    {sprint.status}
                  </Badge>
                </div>
                <CardDescription>
                  {sprint.startDate} - {sprint.endDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sprint.status === 'completed' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Completed</span>
                      <span className="font-medium">
                        {sprint.completedTasks}/{sprint.totalTasks}
                      </span>
                    </div>
                    <Progress
                      value={(sprint.completedTasks / sprint.totalTasks) * 100}
                      className="mt-2"
                    />
                  </div>
                )}

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
                </ul>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
