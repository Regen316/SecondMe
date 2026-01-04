import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Mail, MoreHorizontal, CheckCircle } from 'lucide-react'

const teamMembers = [
  {
    id: '1',
    canonicalName: 'Oleksandra Zhylin',
    nameVariations: ['Oleksandra', 'Alexandra', 'Sasha', 'Sasha Z'],
    role: 'Backend Developer',
    expertise: ['API Development', 'Database Design', 'AWS'],
    active: true,
    tasksAssigned: 5,
    tasksCompleted: 12,
  },
  {
    id: '2',
    canonicalName: 'Mikola Rudinko',
    nameVariations: ['Mikola', 'Nick', 'Nicol'],
    role: 'Backend Developer',
    expertise: ['Microservices', 'Docker', 'Node.js'],
    active: true,
    tasksAssigned: 4,
    tasksCompleted: 18,
  },
  {
    id: '3',
    canonicalName: 'Maria Kovalenko',
    nameVariations: ['Maria', 'Masha'],
    role: 'QA Engineer',
    expertise: ['Test Automation', 'Selenium', 'Jest'],
    active: true,
    tasksAssigned: 3,
    tasksCompleted: 15,
  },
  {
    id: '4',
    canonicalName: 'Petro Bondarenko',
    nameVariations: ['Petro', 'Peter', 'Pete'],
    role: 'Frontend Developer',
    expertise: ['React', 'TypeScript', 'Tailwind CSS'],
    active: true,
    tasksAssigned: 6,
    tasksCompleted: 9,
  },
  {
    id: '5',
    canonicalName: 'Stuart Nealy Jr.',
    nameVariations: ['Stuart', 'Stu'],
    role: 'Project Manager',
    expertise: ['Agile', 'Scrum', 'ClickUp'],
    active: true,
    tasksAssigned: 2,
    tasksCompleted: 8,
  },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500">Manage team members and their name variations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-sm text-gray-500">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {teamMembers.filter((m) => m.active).length}
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {teamMembers.reduce((acc, m) => acc + m.tasksAssigned, 0)}
            </div>
            <p className="text-sm text-gray-500">Tasks In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0)}
            </div>
            <p className="text-sm text-gray-500">Tasks Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(member.canonicalName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {member.canonicalName}
                      {member.active && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Variations */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">NAME VARIATIONS</p>
                <div className="flex flex-wrap gap-1">
                  {member.nameVariations.map((name, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">EXPERTISE</p>
                <div className="flex flex-wrap gap-1">
                  {member.expertise.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {member.tasksAssigned}
                  </div>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {member.tasksCompleted}
                  </div>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
