'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  CheckCircle2,
  Circle,
  Server,
  Cloud,
  Rocket,
  Calendar,
  User,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react'

interface DeploymentChecklist {
  id: string
  featureName: string
  taskIds: string[]
  devDeployed: boolean
  devDeployedAt: string | null
  devDeployedBy: string | null
  stagingDeployed: boolean
  stagingDeployedAt: string | null
  stagingDeployedBy: string | null
  prodDeployed: boolean
  prodDeployedAt: string | null
  prodDeployedBy: string | null
  notes: string | null
  createdAt: string
}

// Mock data - in production this would come from API
const mockChecklists: DeploymentChecklist[] = [
  {
    id: '1',
    featureName: 'User Authentication Flow',
    taskIds: ['task-1', 'task-2', 'task-3'],
    devDeployed: true,
    devDeployedAt: '2026-01-06T10:30:00Z',
    devDeployedBy: 'Nick',
    stagingDeployed: true,
    stagingDeployedAt: '2026-01-07T14:00:00Z',
    stagingDeployedBy: 'Nick',
    prodDeployed: false,
    prodDeployedAt: null,
    prodDeployedBy: null,
    notes: 'Waiting for QA sign-off before production deployment',
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: '2',
    featureName: 'Dashboard Analytics',
    taskIds: ['task-4', 'task-5'],
    devDeployed: true,
    devDeployedAt: '2026-01-04T16:00:00Z',
    devDeployedBy: 'Sasha',
    stagingDeployed: false,
    stagingDeployedAt: null,
    stagingDeployedBy: null,
    prodDeployed: false,
    prodDeployedAt: null,
    prodDeployedBy: null,
    notes: null,
    createdAt: '2026-01-04T10:00:00Z',
  },
  {
    id: '3',
    featureName: 'API Rate Limiting',
    taskIds: ['task-6'],
    devDeployed: true,
    devDeployedAt: '2026-01-03T11:00:00Z',
    devDeployedBy: 'Nick',
    stagingDeployed: true,
    stagingDeployedAt: '2026-01-04T09:00:00Z',
    stagingDeployedBy: 'Nick',
    prodDeployed: true,
    prodDeployedAt: '2026-01-05T08:00:00Z',
    prodDeployedBy: 'Stuart',
    notes: 'Successfully deployed to all environments',
    createdAt: '2026-01-02T14:00:00Z',
  },
]

function EnvironmentStatus({
  label,
  icon: Icon,
  deployed,
  deployedAt,
  deployedBy,
  color,
}: {
  label: string
  icon: typeof Server
  deployed: boolean
  deployedAt: string | null
  deployedBy: string | null
  color: string
}) {
  return (
    <div className={`rounded-lg border p-4 ${deployed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${deployed ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="font-medium text-sm">{label}</span>
        </div>
        {deployed ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </div>
      {deployed && deployedAt && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(deployedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
          {deployedBy && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {deployedBy}
            </div>
          )}
        </div>
      )}
      {!deployed && (
        <Button variant="outline" size="sm" className="w-full mt-2">
          Mark Deployed
        </Button>
      )}
    </div>
  )
}

function ChecklistCard({ checklist }: { checklist: DeploymentChecklist }) {
  const allDeployed = checklist.devDeployed && checklist.stagingDeployed && checklist.prodDeployed
  const progress = [checklist.devDeployed, checklist.stagingDeployed, checklist.prodDeployed].filter(Boolean).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {checklist.featureName}
              {allDeployed && <Badge variant="success">Complete</Badge>}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{checklist.taskIds.length} related task{checklist.taskIds.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{progress}/3 environments</span>
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <EnvironmentStatus
            label="Development"
            icon={Server}
            deployed={checklist.devDeployed}
            deployedAt={checklist.devDeployedAt}
            deployedBy={checklist.devDeployedBy}
            color="blue"
          />
          <EnvironmentStatus
            label="Staging"
            icon={Cloud}
            deployed={checklist.stagingDeployed}
            deployedAt={checklist.stagingDeployedAt}
            deployedBy={checklist.stagingDeployedBy}
            color="yellow"
          />
          <EnvironmentStatus
            label="Production"
            icon={Rocket}
            deployed={checklist.prodDeployed}
            deployedAt={checklist.prodDeployedAt}
            deployedBy={checklist.prodDeployedBy}
            color="green"
          />
        </div>
        {checklist.notes && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <strong className="text-gray-700">Notes:</strong> {checklist.notes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DeploymentsPage() {
  const [showNewForm, setShowNewForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deployment Checklists</h1>
          <p className="text-gray-500">Track feature deployments across environments</p>
        </div>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Checklist
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {mockChecklists.filter(c => c.devDeployed && c.stagingDeployed && c.prodDeployed).length}
            </div>
            <p className="text-sm text-gray-500">Fully Deployed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {mockChecklists.filter(c => (c.devDeployed || c.stagingDeployed) && !c.prodDeployed).length}
            </div>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {mockChecklists.filter(c => !c.devDeployed).length}
            </div>
            <p className="text-sm text-gray-500">Not Started</p>
          </CardContent>
        </Card>
      </div>

      {/* New Checklist Form */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Deployment Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featureName">Feature Name</Label>
              <Input id="featureName" placeholder="e.g., User Authentication Flow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Any deployment notes or requirements..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewForm(false)}>
                Create Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklists */}
      <div className="space-y-4">
        {mockChecklists.map((checklist) => (
          <ChecklistCard key={checklist.id} checklist={checklist} />
        ))}
      </div>
    </div>
  )
}
