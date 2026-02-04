'use client';

import { useState } from 'react';
import { 
  UnitFilters, 
  FilterBarProps, 
  UnitStatus, 
  ViewType,
  STATUS_LABELS 
} from '@/types';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Search,
  Bed,
  DollarSign,
  Layers,
  Eye,
  RotateCcw
} from 'lucide-react';

const STATUS_OPTIONS: { value: UnitStatus; label: string; color: string }[] = [
  { value: 'available', label: 'Available', color: 'bg-emerald-500' },
  { value: 'reserved', label: 'Reserved', color: 'bg-amber-500' },
  { value: 'booked', label: 'Booked', color: 'bg-orange-500' },
  { value: 'spa_signed', label: 'SPA Signed', color: 'bg-blue-500' },
  { value: 'spa_executed', label: 'SPA Executed', color: 'bg-indigo-500' },
  { value: 'registered', label: 'Registered', color: 'bg-purple-500' },
  { value: 'sold', label: 'Sold', color: 'bg-red-500' },
];

const BEDROOM_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1 BR' },
  { value: 2, label: '2 BR' },
  { value: 3, label: '3 BR' },
  { value: 4, label: '4+ BR' },
];

const VIEW_TYPE_OPTIONS: { value: ViewType; label: string; emoji: string }[] = [
  { value: 'sea', label: 'Sea View', emoji: '🌊' },
  { value: 'garden', label: 'Garden', emoji: '🌳' },
  { value: 'pool', label: 'Pool', emoji: '🏊' },
  { value: 'city', label: 'City', emoji: '🏙️' },
  { value: 'park', label: 'Park', emoji: '🌲' },
  { value: 'marina', label: 'Marina', emoji: '⛵' },
];

interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  activeCount?: number;
}

function FilterDropdown({ label, icon, isOpen, onToggle, children, activeCount }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
          border transition-all duration-200
          ${isOpen || activeCount 
            ? 'bg-[#D86DCB]/10 border-[#D86DCB]/50 text-[#D86DCB]' 
            : 'bg-[#1a1a24] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
          }
        `}
      >
        {icon}
        <span>{label}</span>
        {activeCount ? (
          <span className="w-5 h-5 rounded-full bg-[#D86DCB] text-white text-xs flex items-center justify-center">
            {activeCount}
          </span>
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] py-2 bg-[#1a1a24] 
                        border border-white/10 rounded-xl shadow-xl shadow-black/50 z-40">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const updateFilter = <K extends keyof UnitFilters>(key: K, value: UnitFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T,>(
    key: 'status' | 'bedrooms' | 'viewType' | 'floor',
    value: T
  ) => {
    const current = (filters[key] as T[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setOpenDropdown(null);
  };

  const activeFilterCount = 
    (filters.status?.length || 0) +
    (filters.bedrooms?.length || 0) +
    (filters.viewType?.length || 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search units..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
          className="pl-10 pr-4 py-2 w-48 bg-[#1a1a24] border border-white/10 rounded-lg
                     text-white placeholder-gray-500 text-sm
                     focus:outline-none focus:border-[#D86DCB]/50 transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', undefined)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      <div className="w-px h-8 bg-white/10" />

      {/* Status Filter */}
      <FilterDropdown
        label="Status"
        icon={<Filter className="w-4 h-4" />}
        isOpen={openDropdown === 'status'}
        onToggle={() => toggleDropdown('status')}
        activeCount={filters.status?.length}
      >
        {STATUS_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.status?.includes(option.value) || false}
              onChange={() => toggleArrayFilter('status', option.value)}
              className="w-4 h-4 rounded border-white/20 bg-transparent 
                         text-[#D86DCB] focus:ring-[#D86DCB] focus:ring-offset-0"
            />
            <span className={`w-2 h-2 rounded-full ${option.color}`} />
            <span className="text-sm text-white">{option.label}</span>
          </label>
        ))}
      </FilterDropdown>

      {/* Bedrooms Filter */}
      <FilterDropdown
        label="Beds"
        icon={<Bed className="w-4 h-4" />}
        isOpen={openDropdown === 'bedrooms'}
        onToggle={() => toggleDropdown('bedrooms')}
        activeCount={filters.bedrooms?.length}
      >
        {BEDROOM_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.bedrooms?.includes(option.value) || false}
              onChange={() => toggleArrayFilter('bedrooms', option.value)}
              className="w-4 h-4 rounded border-white/20 bg-transparent 
                         text-[#D86DCB] focus:ring-[#D86DCB] focus:ring-offset-0"
            />
            <span className="text-sm text-white">{option.label}</span>
          </label>
        ))}
      </FilterDropdown>

      {/* Price Range Filter */}
      <FilterDropdown
        label="Price"
        icon={<DollarSign className="w-4 h-4" />}
        isOpen={openDropdown === 'price'}
        onToggle={() => toggleDropdown('price')}
        activeCount={filters.priceMin || filters.priceMax ? 1 : 0}
      >
        <div className="px-4 py-3 space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Min Price (AED)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg
                         text-white text-sm focus:outline-none focus:border-[#D86DCB]/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Price (AED)</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg
                         text-white text-sm focus:outline-none focus:border-[#D86DCB]/50"
            />
          </div>
          <div className="flex gap-2 pt-1">
            {[1, 2, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => {
                  updateFilter('priceMin', undefined);
                  updateFilter('priceMax', m * 1000000);
                }}
                className="flex-1 py-1.5 text-xs bg-white/5 hover:bg-white/10 
                           rounded text-gray-400 hover:text-white transition-colors"
              >
                &lt;{m}M
              </button>
            ))}
          </div>
        </div>
      </FilterDropdown>

      {/* View Type Filter */}
      <FilterDropdown
        label="View"
        icon={<Eye className="w-4 h-4" />}
        isOpen={openDropdown === 'viewType'}
        onToggle={() => toggleDropdown('viewType')}
        activeCount={filters.viewType?.length}
      >
        {VIEW_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.viewType?.includes(option.value) || false}
              onChange={() => toggleArrayFilter('viewType', option.value)}
              className="w-4 h-4 rounded border-white/20 bg-transparent 
                         text-[#D86DCB] focus:ring-[#D86DCB] focus:ring-offset-0"
            />
            <span>{option.emoji}</span>
            <span className="text-sm text-white">{option.label}</span>
          </label>
        ))}
      </FilterDropdown>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <>
          <div className="w-px h-8 bg-white/10" />
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 
                       hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear ({activeFilterCount})</span>
          </button>
        </>
      )}

      {/* Click outside to close */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}

export default FilterBar;
