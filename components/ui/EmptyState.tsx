'use client'

import { Building2, Users, FileText, Search, Plus } from 'lucide-react'

type EmptyStateType = 'units' | 'customers' | 'offers' | 'search' | 'generic'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

const DEFAULT_CONFIG: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
  units: {
    icon: <Building2 className="w-12 h-12 text-gray-600" />,
    title: 'No units found',
    description: 'Try adjusting your filters or select a different project to see available units.',
  },
  customers: {
    icon: <Users className="w-12 h-12 text-gray-600" />,
    title: 'No customers yet',
    description: 'Add your first customer to start managing leads and reservations.',
  },
  offers: {
    icon: <FileText className="w-12 h-12 text-gray-600" />,
    title: 'No offers generated',
    description: 'Create an offer for a customer to get started.',
  },
  search: {
    icon: <Search className="w-12 h-12 text-gray-600" />,
    title: 'No results found',
    description: 'Try different search terms or clear your filters.',
  },
  generic: {
    icon: <FileText className="w-12 h-12 text-gray-600" />,
    title: 'Nothing here yet',
    description: 'This section is empty. Add some data to get started.',
  },
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  const config = DEFAULT_CONFIG[type]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-gray-400 max-w-md mb-6">
        {description || config.description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D86DCB] text-white text-sm font-medium
                     rounded-lg hover:bg-[#D86DCB]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
