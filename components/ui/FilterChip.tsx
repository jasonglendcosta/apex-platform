'use client'

import { X } from 'lucide-react'

interface FilterChipProps {
  label: string
  active?: boolean
  onClick: () => void
  onRemove?: () => void
  count?: number
  icon?: React.ReactNode
}

export function FilterChip({
  label,
  active = false,
  onClick,
  onRemove,
  count,
  icon,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-200
        ${active
          ? 'bg-[#D86DCB]/10 border-[#D86DCB]/50 text-[#D86DCB]'
          : 'bg-[#1a1a24] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
            active ? 'bg-[#D86DCB] text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {count}
        </span>
      )}
      {active && onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  )
}

interface FilterChipGroupProps {
  children: React.ReactNode
  className?: string
}

export function FilterChipGroup({ children, className = '' }: FilterChipGroupProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {children}
    </div>
  )
}
