'use client';

import { Fragment, useState } from 'react';
import { 
  UnitDetailModalProps, 
  STATUS_COLORS, 
  STATUS_LABELS,
  VIEW_TYPE_ICONS,
  BEDROOM_LABELS,
  ActivityLog
} from '@/types';
import { 
  X, 
  Bed, 
  Bath, 
  Maximize, 
  MapPin, 
  Compass,
  Eye,
  Layers,
  Calendar,
  FileText,
  Lock,
  DollarSign,
  Clock,
  User,
  TrendingUp,
  Building2
} from 'lucide-react';

// Mock activity data - replace with real data
const mockActivity: ActivityLog[] = [
  {
    id: '1',
    org_id: '1',
    user_id: '1',
    action: 'price_updated',
    entity_type: 'unit',
    entity_id: '1',
    metadata: { old_price: 1400000, new_price: 1500000 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    user: { id: '1', org_id: '1', email: 'admin@one.com', name: 'Admin', role: 'admin', commission_rate: 0, created_at: '' }
  },
  {
    id: '2',
    org_id: '1',
    user_id: '2',
    action: 'offer_generated',
    entity_type: 'unit',
    entity_id: '1',
    metadata: { customer: 'Ahmed Al-Rashid', offer_number: 'OFF-2024-0042' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    user: { id: '2', org_id: '1', email: 'sarah@one.com', name: 'Sarah Johnson', role: 'agent', commission_rate: 2, created_at: '' }
  },
  {
    id: '3',
    org_id: '1',
    user_id: '2',
    action: 'viewing_scheduled',
    entity_type: 'unit',
    entity_id: '1',
    metadata: { customer: 'Mohammed Hassan', date: '2024-01-15' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    user: { id: '2', org_id: '1', email: 'sarah@one.com', name: 'Sarah Johnson', role: 'agent', commission_rate: 2, created_at: '' }
  },
];

function formatPrice(price: number): string {
  return `AED ${price.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getActionIcon(action: string) {
  switch (action) {
    case 'price_updated': return <TrendingUp className="w-4 h-4 text-blue-400" />;
    case 'offer_generated': return <FileText className="w-4 h-4 text-purple-400" />;
    case 'viewing_scheduled': return <Calendar className="w-4 h-4 text-green-400" />;
    case 'reserved': return <Lock className="w-4 h-4 text-amber-400" />;
    case 'status_changed': return <Building2 className="w-4 h-4 text-cyan-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
}

function getActionLabel(action: string, metadata?: Record<string, unknown>): string {
  switch (action) {
    case 'price_updated':
      return `Price updated from ${formatPrice(metadata?.old_price as number)} to ${formatPrice(metadata?.new_price as number)}`;
    case 'offer_generated':
      return `Offer ${metadata?.offer_number} generated for ${metadata?.customer}`;
    case 'viewing_scheduled':
      return `Viewing scheduled with ${metadata?.customer}`;
    case 'reserved':
      return `Unit reserved for ${metadata?.customer}`;
    default:
      return action.replace(/_/g, ' ');
  }
}

export function UnitDetailModal({ 
  unit, 
  isOpen, 
  onClose, 
  onReserve, 
  onGenerateOffer 
}: UnitDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'pricing' | 'activity'>('details');

  if (!isOpen || !unit) return null;

  const statusStyle = STATUS_COLORS[unit.status];
  const viewIcon = unit.view_type ? VIEW_TYPE_ICONS[unit.view_type] : null;
  const bedroomLabel = BEDROOM_LABELS[unit.bedrooms] || `${unit.bedrooms} Bedrooms`;
  const isAvailable = unit.status === 'available';

  // Price breakdown (mock calculations)
  const basePrice = unit.base_price;
  const premiums = {
    floor: unit.floor > 5 ? (unit.floor - 5) * 0.5 / 100 * basePrice : 0,
    view: unit.view_type === 'sea' ? basePrice * 0.05 : 0,
  };
  const totalPremiums = Object.values(premiums).reduce((a, b) => a + b, 0);
  const finalPrice = basePrice + totalPremiums;

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#0a0a0f] border border-white/10 
                      rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D86DCB]/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#D86DCB]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{unit.unit_number}</h2>
              <p className="text-gray-400">{unit.project?.name || 'Laguna Residence'} • Floor {unit.floor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              {STATUS_LABELS[unit.status]}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/10">
          {(['details', 'pricing', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                         ${activeTab === tab 
                           ? 'bg-white/5 text-[#D86DCB] border-b-2 border-[#D86DCB]' 
                           : 'text-gray-400 hover:text-white'
                         }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Specs */}
              <div className="space-y-6">
                {/* Floor Plan Placeholder */}
                <div className="aspect-video bg-[#1a1a24] rounded-xl border border-white/10 
                               flex items-center justify-center">
                  {unit.floor_plan_url ? (
                    <img 
                      src={unit.floor_plan_url} 
                      alt="Floor Plan" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Floor plan not available</p>
                    </div>
                  )}
                </div>

                {/* Unit Specifications */}
                <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
                  <h3 className="font-semibold text-white mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-[#D86DCB]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="font-medium text-white">{bedroomLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Bath className="w-5 h-5 text-[#D86DCB]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bathrooms</p>
                        <p className="font-medium text-white">{unit.bathrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Maximize className="w-5 h-5 text-[#D86DCB]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="font-medium text-white">
                          {unit.area_sqft.toLocaleString()} sqft
                          <span className="text-gray-500 text-sm ml-1">
                            ({unit.area_sqm.toLocaleString()} m²)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-[#D86DCB]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Floor</p>
                        <p className="font-medium text-white">Level {unit.floor}</p>
                      </div>
                    </div>

                    {unit.view_type && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-[#D86DCB]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">View</p>
                          <p className="font-medium text-white capitalize">
                            {viewIcon} {unit.view_type}
                          </p>
                        </div>
                      </div>
                    )}

                    {unit.aspect && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <Compass className="w-5 h-5 text-[#D86DCB]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Aspect</p>
                          <p className="font-medium text-white">{unit.aspect}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Price & Actions */}
              <div className="space-y-6">
                {/* Price Card */}
                <div className="bg-gradient-to-br from-[#D86DCB]/20 to-[#1a1a24] 
                               rounded-xl p-6 border border-[#D86DCB]/30">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400">Current Price</p>
                    <p className="text-sm text-[#D86DCB]">
                      AED {unit.price_per_sqft.toLocaleString()} /sqft
                    </p>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">
                    {formatPrice(unit.current_price)}
                  </p>
                  {unit.current_price !== unit.base_price && (
                    <p className="text-sm text-gray-500 line-through">
                      Base: {formatPrice(unit.base_price)}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isAvailable && (
                    <button
                      onClick={() => onReserve?.(unit)}
                      className="w-full py-4 bg-[#D86DCB] hover:bg-[#D86DCB]/90 
                                 text-white font-semibold rounded-xl transition-colors
                                 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Reserve Unit
                    </button>
                  )}
                  
                  <button
                    onClick={() => onGenerateOffer?.(unit)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10
                               text-white font-semibold rounded-xl transition-colors
                               flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Generate Offer
                  </button>
                </div>

                {/* Reservation Info (if reserved) */}
                {unit.status === 'reserved' && unit.reservation_expires_at && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Reserved</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Expires: {formatDate(unit.reservation_expires_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="max-w-2xl">
              <div className="bg-[#1a1a24] rounded-xl border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h3 className="font-semibold text-white">Price Breakdown</h3>
                </div>
                
                <div className="divide-y divide-white/5">
                  <div className="flex justify-between p-4">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white font-medium">{formatPrice(basePrice)}</span>
                  </div>
                  
                  {premiums.floor > 0 && (
                    <div className="flex justify-between p-4">
                      <span className="text-gray-400">Floor Premium (Level {unit.floor})</span>
                      <span className="text-emerald-400">+{formatPrice(premiums.floor)}</span>
                    </div>
                  )}
                  
                  {premiums.view > 0 && (
                    <div className="flex justify-between p-4">
                      <span className="text-gray-400">View Premium ({unit.view_type})</span>
                      <span className="text-emerald-400">+{formatPrice(premiums.view)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between p-4 bg-[#D86DCB]/10">
                    <span className="text-white font-semibold">Final Price</span>
                    <span className="text-[#D86DCB] font-bold text-xl">{formatPrice(unit.current_price)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Plans Preview */}
              <div className="mt-6 bg-[#1a1a24] rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-white mb-4">Available Payment Plans</h3>
                <div className="space-y-3">
                  {[
                    { name: '60/40', description: '60% during construction, 40% on handover' },
                    { name: '80/20', description: '80% during construction, 20% post-handover' },
                    { name: '70/30', description: '70% during construction, 30% post-handover (2 years)' },
                  ].map((plan) => (
                    <div 
                      key={plan.name}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.description}</p>
                      </div>
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="max-w-2xl">
              <div className="bg-[#1a1a24] rounded-xl border border-white/10">
                <div className="p-5 border-b border-white/10">
                  <h3 className="font-semibold text-white">Activity History</h3>
                </div>
                
                <div className="divide-y divide-white/5">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="p-4 flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">
                          {getActionLabel(activity.action, activity.metadata)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{activity.user?.name}</span>
                          <span>•</span>
                          <span>{formatDate(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default UnitDetailModal;
