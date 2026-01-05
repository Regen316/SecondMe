'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, MoreHorizontal, CheckCircle, FolderOpen, Users } from 'lucide-react'
import { useTeamMembers } from '@/hooks/use-project-data'
import { useProjectStore } from '@/stores/project-store'

interface TeamMember {
  id: string
  canonicalName: string
  nameVariations: string[]
  role: string | null
  expertise: string[]
  active: boolean
  _count?: {
    tasks: number
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-8 w-12 mb-1" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}

function TeamMemberCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="h-3 w-24 mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div className="text-center">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TeamPage() {
  const { currentProjectId } = useProjectStore()
  const { data: teamData, isLoading } = useTeamMembers()

  const teamMembers = (teamData?.teamMembers || []) as TeamMember[]
  const activeMembers = teamMembers.filter((m) => m.active)
  const totalTasks = teamMembers.reduce((acc, m) => acc + (m._count?.tasks || 0), 0)

  if (!currentProjectId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-500 mb-4">Select or create a project to manage team members</p>
        <p className="text-sm text-gray-400">Use the project selector in the header</p>
      </div>
    )
  }

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
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-sm text-gray-500">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{activeMembers.length}</div>
                <p className="text-sm text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-sm text-gray-500">Tasks Assigned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {teamMembers.reduce((acc, m) => acc + m.nameVariations.length, 0)}
                </div>
                <p className="text-sm text-gray-500">Name Variations</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Team Members Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TeamMemberCardSkeleton />
          <TeamMemberCardSkeleton />
          <TeamMemberCardSkeleton />
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No team members yet</h3>
          <p className="text-gray-500 mb-4">Add team members to start assigning tasks</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      ) : (
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
                      <CardDescription>{member.role || 'Team Member'}</CardDescription>
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
                    {member.nameVariations.length > 0 ? (
                      member.nameVariations.map((name, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No variations</span>
                    )}
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500">EXPERTISE</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.length > 0 ? (
                      member.expertise.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {member._count?.tasks || 0}
                    </div>
                    <p className="text-xs text-gray-500">Tasks Assigned</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {member.active ? 'Active' : 'Inactive'}
                    </div>
                    <p className="text-xs text-gray-500">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
