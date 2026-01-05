'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell, Search, ChevronDown, Plus, Check, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useProjectStore, fetchProjects, createProject, Project } from '@/stores/project-store'

function ProjectSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    projects,
    currentProjectId,
    isLoading,
    setProjects,
    setCurrentProject,
    setLoading,
    addProject,
  } = useProjectStore()

  const currentProject = projects.find((p) => p.id === currentProjectId)

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      try {
        const data = await fetchProjects()
        setProjects(data)
        // Auto-select first project if none selected
        if (!currentProjectId && data.length > 0) {
          setCurrentProject(data[0].id)
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsCreating(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    try {
      const project = await createProject(newProjectName.trim())
      addProject(project)
      setCurrentProject(project.id)
      setNewProjectName('')
      setIsCreating(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="gap-2 min-w-[180px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-gray-400" />
          <span className="truncate max-w-[120px]">
            {isLoading ? 'Loading...' : currentProject?.name || 'Select Project'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
          <div className="p-2">
            {projects.length === 0 && !isLoading ? (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No projects yet
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setCurrentProject(project.id)
                      setIsOpen(false)
                    }}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      {project._count && (
                        <p className="text-xs text-gray-500">
                          {project._count.tasks} tasks • {project._count.teamMembers} members
                        </p>
                      )}
                    </div>
                    {project.id === currentProjectId && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-2">
            {isCreating ? (
              <div className="space-y-2">
                <Input
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateProject()
                    if (e.key === 'Escape') setIsCreating(false)
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={handleCreateProject}>
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setNewProjectName('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left section - Project selector */}
      <div className="flex items-center gap-4">
        <ProjectSelector />
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search tasks, documents..." className="pl-9" />
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
              SN
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Stuart N.</p>
            <p className="text-xs text-gray-500">Project Manager</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  )
}
