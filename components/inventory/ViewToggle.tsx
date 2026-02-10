'use client';

import { LayoutGrid, Table, Layers, Box } from 'lucide-react';

type InventoryViewMode = 'grid' | 'table' | 'floor' | '3d';

interface ViewToggleProps {
  currentView: InventoryViewMode;
  onViewChange: (view: InventoryViewMode) => void;
}

interface ViewOption {
  value: InventoryViewMode;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const viewOptions: ViewOption[] = [
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
  { value: 'table', label: 'Table', icon: <Table className="w-4 h-4" /> },
  { value: 'floor', label: 'Floor', icon: <Layers className="w-4 h-4" /> },
  { value: '3d', label: '3D', icon: <Box className="w-4 h-4" />, disabled: true },
];

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-[#1a1a24] border border-white/10 rounded-xl p-1">
      {viewOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => !option.disabled && onViewChange(option.value)}
          disabled={option.disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${currentView === option.value 
              ? 'bg-[#D86DCB] text-white shadow-lg shadow-[#D86DCB]/25' 
              : option.disabled
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
          title={option.disabled ? 'Coming soon' : option.label}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
          {option.disabled && (
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 hidden sm:inline">
              Soon
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;
