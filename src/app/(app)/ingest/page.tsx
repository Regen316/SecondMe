'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Upload,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

type IngestMode = 'paste' | 'upload' | 'screenshot'

export default function IngestPage() {
  const [mode, setMode] = useState<IngestMode>('paste')
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async () => {
    if (!transcript.trim()) return
    setIsProcessing(true)
    // TODO: Implement AI processing
    setTimeout(() => setIsProcessing(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ingest Meeting Data</h1>
        <p className="text-gray-500">
          Upload transcripts, documents, or screenshots to extract tasks automatically.
        </p>
      </div>

      {/* Input Mode Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`cursor-pointer transition-all ${
            mode === 'paste' ? 'ring-2 ring-blue-600' : 'hover:border-gray-300'
          }`}
          onClick={() => setMode('paste')}
        >
          <CardContent className="flex flex-col items-center gap-3 pt-6">
            <div className="rounded-full bg-blue-100 p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Paste Text</h3>
              <p className="text-sm text-gray-500">Copy & paste meeting transcript</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            mode === 'upload' ? 'ring-2 ring-blue-600' : 'hover:border-gray-300'
          }`}
          onClick={() => setMode('upload')}
        >
          <CardContent className="flex flex-col items-center gap-3 pt-6">
            <div className="rounded-full bg-green-100 p-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Upload Document</h3>
              <p className="text-sm text-gray-500">.txt, .docx, .pdf files</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            mode === 'screenshot' ? 'ring-2 ring-blue-600' : 'hover:border-gray-300'
          }`}
          onClick={() => setMode('screenshot')}
        >
          <CardContent className="flex flex-col items-center gap-3 pt-6">
            <div className="rounded-full bg-purple-100 p-3">
              <ImageIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Screenshot</h3>
              <p className="text-sm text-gray-500">Slack, Teams, or meeting captures</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {mode === 'paste' && 'Paste Meeting Transcript'}
            {mode === 'upload' && 'Upload Document'}
            {mode === 'screenshot' && 'Upload Screenshot'}
          </CardTitle>
          <CardDescription>
            {mode === 'paste' &&
              'Paste your meeting transcript below. We will extract tasks, assignees, and priorities.'}
            {mode === 'upload' &&
              'Upload a document containing meeting notes or requirements.'}
            {mode === 'screenshot' &&
              'Upload screenshots from Slack, Teams, or other communication tools.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'paste' && (
            <div className="space-y-2">
              <Label htmlFor="transcript">Meeting Transcript</Label>
              <Textarea
                id="transcript"
                placeholder="Paste your meeting transcript here...

Example:
Sarah: We need to fix the login button alignment on mobile.
Nick: I can take that. Also, the API rate limiting needs updating.
Sarah: Great. Maria, can you write tests for the auth flow?
Maria: Sure, I'll have them done by end of sprint."
                className="min-h-[300px] font-mono text-sm"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          )}

          {mode === 'upload' && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12">
              <Upload className="mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-sm font-medium text-gray-900">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                Supports .txt, .docx, .pdf up to 10MB
              </p>
              <Button variant="outline" className="mt-4">
                Select Files
              </Button>
            </div>
          )}

          {mode === 'screenshot' && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12">
              <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-sm font-medium text-gray-900">
                Drop screenshots here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                Supports .png, .jpg up to 10MB - OCR will extract text
              </p>
              <Button variant="outline" className="mt-4">
                Select Images
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setTranscript('')}>
              Clear
            </Button>
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !transcript.trim()}
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  Extract Tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">1.</span>
              Include speaker names before each statement
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">2.</span>
              Mention deadlines or priorities when discussed
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">3.</span>
              Include context about bugs or feature requests
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">4.</span>
              Use consistent name formats for team members
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
