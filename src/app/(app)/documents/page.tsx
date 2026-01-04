import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Download,
  MoreHorizontal,
  Eye,
} from 'lucide-react'

const documents = [
  {
    id: '1',
    type: 'meeting_minutes',
    title: 'Sprint 23 Planning Meeting',
    createdAt: 'Jan 6, 2026',
    generatedFrom: 'Meeting transcript',
  },
  {
    id: '2',
    type: 'sprint_summary',
    title: 'Sprint 22 Summary',
    createdAt: 'Jan 3, 2026',
    generatedFrom: 'Sprint 22 data',
  },
  {
    id: '3',
    type: 'status_update',
    title: 'Weekly Status - Week 1',
    createdAt: 'Jan 3, 2026',
    generatedFrom: 'Auto-generated',
  },
  {
    id: '4',
    type: 'meeting_minutes',
    title: 'Daily Standup - Jan 7',
    createdAt: 'Jan 7, 2026',
    generatedFrom: 'Meeting transcript',
  },
  {
    id: '5',
    type: 'technical_doc',
    title: 'API Authentication Flow',
    createdAt: 'Dec 28, 2025',
    generatedFrom: 'Task descriptions',
  },
]

const documentTypes = {
  meeting_minutes: { label: 'Meeting Minutes', color: 'bg-blue-100 text-blue-700', icon: FileText },
  sprint_summary: { label: 'Sprint Summary', color: 'bg-green-100 text-green-700', icon: Calendar },
  status_update: { label: 'Status Update', color: 'bg-purple-100 text-purple-700', icon: BarChart3 },
  technical_doc: { label: 'Technical Doc', color: 'bg-orange-100 text-orange-700', icon: FileText },
  requirements: { label: 'Requirements', color: 'bg-gray-100 text-gray-700', icon: FileText },
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Generated meeting minutes, summaries, and reports</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
      </div>

      {/* Quick Generate */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(documentTypes).slice(0, 4).map(([key, type]) => (
          <Card key={key} className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${type.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                <type.icon className={`h-5 w-5 ${type.color.split(' ')[1]}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{type.label}</p>
                <p className="text-xs text-gray-500">Generate new</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your generated documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => {
              const typeInfo = documentTypes[doc.type as keyof typeof documentTypes]
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${typeInfo.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                      <typeInfo.icon className={`h-5 w-5 ${typeInfo.color.split(' ')[1]}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.createdAt}</span>
                        <span>•</span>
                        <span>{doc.generatedFrom}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {typeInfo.label}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
