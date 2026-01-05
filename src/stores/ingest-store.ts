import { create } from 'zustand'

export interface ExtractedTask {
  id: string
  title: string
  description: string
  assignee: string | null
  assigneeId: string | null
  assigneeName: string | null
  category: 'frontend' | 'backend' | 'full_stack' | 'qa' | 'documentation' | null
  priority: 'high' | 'medium' | 'low' | null
  selected: boolean
  isDuplicate: boolean
  duplicateOf: string | null
}

interface IngestState {
  // Input
  transcript: string
  projectId: string | null

  // Processing
  isProcessing: boolean
  error: string | null

  // Extracted tasks
  extractedTasks: ExtractedTask[]

  // Usage stats
  usage: {
    inputTokens: number
    outputTokens: number
    costUsd: number
  } | null

  // Actions
  setTranscript: (transcript: string) => void
  setProjectId: (projectId: string) => void
  setProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  setExtractedTasks: (tasks: ExtractedTask[]) => void
  setUsage: (usage: { inputTokens: number; outputTokens: number; costUsd: number }) => void
  toggleTaskSelection: (taskId: string) => void
  updateTask: (taskId: string, updates: Partial<ExtractedTask>) => void
  removeTask: (taskId: string) => void
  selectAllTasks: () => void
  deselectAllTasks: () => void
  reset: () => void
}

export const useIngestStore = create<IngestState>((set) => ({
  transcript: '',
  projectId: null,
  isProcessing: false,
  error: null,
  extractedTasks: [],
  usage: null,

  setTranscript: (transcript) => set({ transcript }),
  setProjectId: (projectId) => set({ projectId }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setExtractedTasks: (tasks) => set({ extractedTasks: tasks }),
  setUsage: (usage) => set({ usage }),

  toggleTaskSelection: (taskId) =>
    set((state) => ({
      extractedTasks: state.extractedTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      ),
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      extractedTasks: state.extractedTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      extractedTasks: state.extractedTasks.filter((task) => task.id !== taskId),
    })),

  selectAllTasks: () =>
    set((state) => ({
      extractedTasks: state.extractedTasks.map((task) => ({ ...task, selected: true })),
    })),

  deselectAllTasks: () =>
    set((state) => ({
      extractedTasks: state.extractedTasks.map((task) => ({ ...task, selected: false })),
    })),

  reset: () =>
    set({
      transcript: '',
      isProcessing: false,
      error: null,
      extractedTasks: [],
      usage: null,
    }),
}))
