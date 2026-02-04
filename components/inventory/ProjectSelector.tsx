'use client';

import { useState, useRef, useEffect } from 'react';
import { Project, ProjectSelectorProps } from '@/types';
import { ChevronDown, Building2, MapPin } from 'lucide-react';

export function ProjectSelector({ 
  projects, 
  selectedProjectId, 
  onSelect 
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: Project['status']) => {
    const styles = {
      active: 'bg-emerald-500/20 text-emerald-400',
      sold_out: 'bg-red-500/20 text-red-400',
      upcoming: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-gray-500/20 text-gray-400',
    };
    const labels = {
      active: 'Active',
      sold_out: 'Sold Out',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] border border-white/10 
                   rounded-xl hover:border-[#D86DCB]/50 transition-all duration-200
                   min-w-[280px] text-left group"
      >
        <div className="w-10 h-10 rounded-lg bg-[#D86DCB]/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#D86DCB]" />
        </div>
        
        <div className="flex-1 min-w-0">
          {selectedProject ? (
            <>
              <p className="font-semibold text-white truncate">
                {selectedProject.name}
              </p>
              <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedProject.location || 'Location TBD'}
              </p>
            </>
          ) : (
            <p className="text-gray-400">Select a project...</p>
          )}
        </div>

        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                      ${isOpen ? 'rotate-180' : ''} group-hover:text-[#D86DCB]`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-[#1a1a24] 
                        border border-white/10 rounded-xl shadow-xl shadow-black/50 z-50
                        max-h-[400px] overflow-y-auto">
          {projects.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No projects available</p>
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelect(project.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left
                           hover:bg-white/5 transition-colors
                           ${project.id === selectedProjectId ? 'bg-[#D86DCB]/10 border-l-2 border-[#D86DCB]' : ''}`}
              >
                {/* Project Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D86DCB]/30 to-[#D86DCB]/10 
                               flex items-center justify-center overflow-hidden flex-shrink-0">
                  {project.hero_image_url ? (
                    <img 
                      src={project.hero_image_url} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#D86DCB]" />
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">
                      {project.name}
                    </p>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {project.location || 'Location TBD'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {project.total_units} units
                  </p>
                </div>

                {/* Selected Indicator */}
                {project.id === selectedProjectId && (
                  <div className="w-2 h-2 rounded-full bg-[#D86DCB]" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectSelector;
