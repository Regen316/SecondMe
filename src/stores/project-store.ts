import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
  _count?: {
    tasks: number
    teamMembers: number
    sprints: number
    documents: number
  }
}

interface ProjectState {
  projects: Project[]
  currentProjectId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setProjects: (projects: Project[]) => void
  setCurrentProject: (projectId: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  addProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  removeProject: (projectId: string) => void

  // Computed
  getCurrentProject: () => Project | null
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isLoading: false,
      error: null,

      setProjects: (projects) => set({ projects }),

      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),

      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, ...updates } : p
          ),
        })),

      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProjectId:
            state.currentProjectId === projectId ? null : state.currentProjectId,
        })),

      getCurrentProject: () => {
        const state = get()
        return state.projects.find((p) => p.id === state.currentProjectId) || null
      },
    }),
    {
      name: 'secondme-project',
      partialize: (state) => ({ currentProjectId: state.currentProjectId }),
    }
  )
)

// Fetch projects helper
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects')
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  const data = await response.json()
  return data.projects
}

// Create project helper
export async function createProject(name: string, description?: string): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  })
  if (!response.ok) {
    throw new Error('Failed to create project')
  }
  const data = await response.json()
  return data.project
}
