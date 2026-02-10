'use client';

import { Unit } from '@/types';
import { UnitCard } from './UnitCard';
import { Building2, Loader2 } from 'lucide-react';

interface UnitGridProps {
  units: Unit[];
  loading: boolean;
  onUnitClick?: (unit: Unit) => void;
  selectedUnitId?: string;
}

export function UnitGrid({ 
  units, 
  loading, 
  onUnitClick, 
  selectedUnitId 
}: UnitGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#D86DCB] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading units...</p>
        </div>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No units found</h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your filters or select a different project to see available units.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onClick={onUnitClick}
          selected={unit.id === selectedUnitId}
        />
      ))}
    </div>
  );
}

export default UnitGrid;
