'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useIngestStore, ExtractedTask } from '@/stores/ingest-store'
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  Copy,
  CheckSquare,
  Square,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Edit2,
  Save,
} from 'lucide-react'
import { useState } from 'react'

function TaskCard({
  task,
  onToggle,
  onUpdate,
  onRemove,
}: {
  task: ExtractedTask
  onToggle: () => void
  onUpdate: (updates: Partial<ExtractedTask>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  }

  const categoryVariant = task.category as 'frontend' | 'backend' | 'fullstack' | 'qa' | 'documentation' | undefined

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="space-y-3 pt-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Title</label>
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Description</label>
            <Textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-500">Assignee</label>
              <Input
                value={editedTask.assigneeName || ''}
                onChange={(e) => setEditedTask({ ...editedTask, assigneeName: e.target.value })}
                className="mt-1"
                placeholder="Unassigned"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Category</label>
              <select
                value={editedTask.category || ''}
                onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value as ExtractedTask['category'] })}
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="full_stack">Full Stack</option>
                <option value="qa">QA</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Priority</label>
              <select
                value={editedTask.priority || ''}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as ExtractedTask['priority'] })}
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all ${task.selected ? 'border-blue-200 bg-blue-50/30' : 'opacity-60'}`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <button onClick={onToggle} className="mt-1 shrink-0">
            {task.selected ? (
              <CheckSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onRemove}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="mb-3 text-sm text-gray-600">{task.description}</p>

            <div className="flex flex-wrap items-center gap-2">
              {task.category && (
                <Badge variant={categoryVariant === 'full_stack' ? 'fullstack' : categoryVariant}>
                  {task.category.replace('_', ' ')}
                </Badge>
              )}
              {task.priority && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              )}
              {task.assigneeName && (
                <span className="text-xs text-gray-500">
                  Assigned to <span className="font-medium">{task.assigneeName}</span>
                </span>
              )}
            </div>

            {task.isDuplicate && (
              <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                Possible duplicate
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReviewPage() {
  const router = useRouter()
  const {
    extractedTasks,
    usage,
    toggleTaskSelection,
    updateTask,
    removeTask,
    selectAllTasks,
    deselectAllTasks,
    reset,
  } = useIngestStore()

  const selectedCount = extractedTasks.filter((t) => t.selected).length

  const handleCreateTasks = async () => {
    const selectedTasks = extractedTasks.filter((t) => t.selected)

    // For now, just log - in production, this would call the API
    console.log('Creating tasks:', selectedTasks)

    // Reset and go to board
    reset()
    router.push('/board')
  }

  const handleCopyClickUp = () => {
    const selectedTasks = extractedTasks.filter((t) => t.selected)
    const formatted = selectedTasks
      .map(
        (task) => `
Title: ${task.title}

Description:
${task.description}

Assignee: ${task.assigneeName || 'Unassigned'}
Category: ${task.category || 'N/A'}
Priority: ${task.priority || 'Medium'}

---`
      )
      .join('\n')

    navigator.clipboard.writeText(formatted)
  }

  if (extractedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Sparkles className="mb-4 h-12 w-12 text-gray-300" />
        <h2 className="mb-2 text-lg font-medium text-gray-900">No tasks to review</h2>
        <p className="mb-4 text-gray-500">Extract tasks from a meeting transcript first</p>
        <Button onClick={() => router.push('/ingest')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Ingest
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push('/ingest')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Review Extracted Tasks</h1>
          </div>
          <p className="ml-10 text-gray-500">
            {extractedTasks.length} tasks extracted • {selectedCount} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyClickUp}>
            <Copy className="mr-2 h-4 w-4" />
            Copy for ClickUp
          </Button>
          <Button onClick={handleCreateTasks} disabled={selectedCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Create {selectedCount} Task{selectedCount !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>

      {/* Usage Stats */}
      {usage && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500">Input Tokens</p>
                <p className="text-sm font-medium">{usage.inputTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Output Tokens</p>
                <p className="text-sm font-medium">{usage.outputTokens.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Cost</p>
                  <p className="text-sm font-medium">${usage.costUsd.toFixed(4)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={selectAllTasks}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllTasks}>
                Deselect All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {extractedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => toggleTaskSelection(task.id)}
            onUpdate={(updates) => updateTask(task.id, updates)}
            onRemove={() => removeTask(task.id)}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white py-4">
        <Button variant="outline" onClick={() => router.push('/ingest')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ingest
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyClickUp}>
            <Copy className="mr-2 h-4 w-4" />
            Copy for ClickUp
          </Button>
          <Button onClick={handleCreateTasks} disabled={selectedCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Create {selectedCount} Task{selectedCount !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}
