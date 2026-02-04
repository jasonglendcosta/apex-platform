'use client';

import { 
  Unit, 
  UnitCardProps, 
  STATUS_COLORS, 
  STATUS_LABELS,
  VIEW_TYPE_ICONS,
  BEDROOM_LABELS 
} from '@/types';
import { Bed, Maximize, MapPin, Clock } from 'lucide-react';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  }
  return `AED ${price.toLocaleString()}`;
}

function formatTimeRemaining(expiresAt: string | undefined): string | null {
  if (!expiresAt) return null;
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function UnitCard({ unit, onClick, selected, compact }: UnitCardProps) {
  const statusStyle = STATUS_COLORS[unit.status];
  const isAvailable = unit.status === 'available';
  const viewIcon = unit.view_type ? VIEW_TYPE_ICONS[unit.view_type] : null;
  const bedroomLabel = BEDROOM_LABELS[unit.bedrooms] || `${unit.bedrooms} BR`;
  const timeRemaining = formatTimeRemaining(unit.reservation_expires_at);

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(unit)}
        className={`
          relative p-3 rounded-lg border transition-all duration-200
          ${selected 
            ? 'bg-[#D86DCB]/20 border-[#D86DCB] ring-2 ring-[#D86DCB]/30' 
            : `bg-[#1a1a24] border-white/10 hover:border-white/20 hover:bg-[#1a1a24]/80`
          }
          ${statusStyle.border}
        `}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">{unit.unit_number}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            {STATUS_LABELS[unit.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{bedroomLabel}</span>
          <span>•</span>
          <span>{unit.area_sqft} sqft</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick?.(unit)}
      className={`
        relative group text-left w-full
        bg-[#1a1a24] rounded-xl overflow-hidden
        border transition-all duration-300
        hover:shadow-xl hover:shadow-[#D86DCB]/10
        hover:-translate-y-1
        ${selected 
          ? 'border-[#D86DCB] ring-2 ring-[#D86DCB]/30' 
          : 'border-white/10 hover:border-[#D86DCB]/50'
        }
      `}
    >
      {/* Status Banner */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusStyle.bg.replace('/20', '')}`} />

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-[#D86DCB] transition-colors">
              {unit.unit_number}
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Floor {unit.floor}
              {unit.aspect && ` • ${unit.aspect}`}
            </p>
          </div>
          
          {/* Status Badge */}
          <span className={`
            px-2.5 py-1 rounded-lg text-xs font-semibold
            ${statusStyle.bg} ${statusStyle.text}
          `}>
            {STATUS_LABELS[unit.status]}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <Bed className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-white">{bedroomLabel}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <Maximize className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-white">{unit.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* View Type */}
        {viewIcon && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <span>{viewIcon}</span>
            <span className="capitalize">{unit.view_type} View</span>
          </div>
        )}

        {/* Price */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Price</p>
              <p className="text-xl font-bold text-white">
                {formatPrice(unit.current_price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Per sqft</p>
              <p className="text-sm font-medium text-[#D86DCB]">
                AED {unit.price_per_sqft.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Timer (if reserved) */}
        {unit.status === 'reserved' && timeRemaining && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400">
              Expires in {timeRemaining}
            </span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#D86DCB]/10 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}

export default UnitCard;
