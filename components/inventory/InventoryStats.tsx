'use client';

import { 
  Building2, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react';

interface InventoryStatsProps {
  stats?: {
    [key: string]: number | string;
  };
  loading?: boolean;
}

function formatValue(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  return value.toLocaleString();
}

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  loading?: boolean;
}

function StatCard({ label, value, subValue, icon, color, bgColor, loading }: StatCardProps) {
  return (
    <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
          ) : (
            <p className={`text-2xl font-bold ${color}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
          {subValue && !loading && (
            <p className="text-xs text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
          {loading ? (
            <Loader2 className={`w-6 h-6 ${color} animate-spin`} />
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_STATS = {
  total: 250,
  available: 112,
  reserved: 38,
  sold: 100,
};

export function InventoryStats({ stats = DEFAULT_STATS, loading = false }: InventoryStatsProps) {
  const statsData = stats || DEFAULT_STATS;
  const availablePercent = (statsData.total as number) > 0 
    ? Math.round(((statsData.available as number) / (statsData.total as number)) * 100) 
    : 0;
  
  const soldPercent = (statsData.total as number) > 0 
    ? Math.round(((statsData.sold as number) / (statsData.total as number)) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Units"
          value={statsData.total}
          icon={<Building2 className="w-6 h-6 text-[#D86DCB]" />}
          color="text-white"
          bgColor="bg-[#D86DCB]/20"
          loading={loading}
        />
        
        <StatCard
          label="Available"
          value={statsData.available}
          subValue={`${availablePercent}% of inventory`}
          icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
          color="text-emerald-400"
          bgColor="bg-emerald-500/20"
          loading={loading}
        />
        
        <StatCard
          label="Reserved"
          value={(statsData.reserved as number) + (statsData.booked as number)}
          subValue="Active reservations"
          icon={<Clock className="w-6 h-6 text-amber-400" />}
          color="text-amber-400"
          bgColor="bg-amber-500/20"
          loading={loading}
        />
        
        <StatCard
          label="Sold"
          value={statsData.sold}
          subValue={`${soldPercent}% sold`}
          icon={<XCircle className="w-6 h-6 text-red-400" />}
          color="text-red-400"
          bgColor="bg-red-500/20"
          loading={loading}
        />
      </div>

      {/* Value Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">Total Inventory Value</span>
          </div>
          {loading ? (
            <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white">
              AED {formatValue((statsData.total as number))}
            </p>
          )}
        </div>

        <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-gray-400">Available Value</span>
          </div>
          {loading ? (
            <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-emerald-400">
              AED {formatValue((statsData.available as number))}
            </p>
          )}
        </div>

        <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-gray-400">Sold Value</span>
          </div>
          {loading ? (
            <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-purple-400">
              AED {formatValue(stats.soldValue)}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Sales Progress</span>
          <span className="text-sm font-medium text-white">{soldPercent}% Sold</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
          {!loading && (
            <>
              {/* Sold */}
              <div 
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${soldPercent}%` }}
              />
              {/* Reserved/Booked */}
              <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.round(((((statsData.reserved as number) + (statsData.booked as number))) / (statsData.total as number)) * 100)}%` }}
              />
              {/* Available */}
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${availablePercent}%` }}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-400">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryStats;
