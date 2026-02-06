'use client'

import { useState } from 'react'
import { Building, ChevronDown, Check, MapPin } from 'lucide-react'

interface Project {
  id: string
  name: string
  location: string
  units: number
  color: string
}

interface ProjectSelectorProps {
  projects?: Project[]
  selected?: string
  onSelect?: (id: string) => void
}

const defaultProjects: Project[] = [
  { id: 'all', name: 'All Projects', location: 'Portfolio Overview', units: 250, color: '#D86DCB' },
  { id: 'laguna', name: 'Laguna Residence', location: 'Al Reem Island, Abu Dhabi', units: 120, color: '#10B981' },
  { id: 'do-dubai', name: 'DO Dubai Island', location: 'Dubai', units: 80, color: '#8B5CF6' },
  { id: 'infinity', name: 'Infinity One', location: 'Al Reem Island, Abu Dhabi', units: 50, color: '#22D3EE' },
]

export function ProjectSelector({ 
  projects = defaultProjects, 
  selected = 'all',
  onSelect 
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedProject = projects.find(p => p.id === selected) || projects[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-apex-card border border-apex-border rounded-xl hover:border-apex-pink/50 transition-all duration-200 min-w-[280px]"
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${selectedProject.color}20` }}
        >
          <Building className="w-5 h-5" style={{ color: selectedProject.color }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">{selectedProject.name}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {selectedProject.location}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-apex-card border border-apex-border rounded-xl shadow-xl shadow-black/40 z-50 overflow-hidden animate-slide-down">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelect?.(project.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-apex-darker/50 transition-colors ${
                  selected === project.id ? 'bg-apex-darker/30' : ''
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <Building className="w-5 h-5" style={{ color: project.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-white">{project.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                    <span>•</span>
                    <span>{project.units} units</span>
                  </div>
                </div>
                {selected === project.id && (
                  <Check className="w-5 h-5 text-apex-pink" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
