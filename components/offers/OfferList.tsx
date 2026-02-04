'use client';

import React, { useState } from 'react';
import { Offer, OfferStatus } from '../../types';

interface OfferListProps {
  offers: Offer[];
  onDownload: (offer: Offer) => void;
  onResend: (offer: Offer) => void;
  onCopyLink: (offer: Offer) => void;
  onViewDetails: (offer: Offer) => void;
  onUpdateStatus: (offerId: string, status: OfferStatus) => void;
  isLoading?: boolean;
}

const statusConfig: Record<OfferStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  sent: { label: 'Sent', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  viewed: { label: 'Viewed', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  accepted: { label: 'Accepted', color: 'text-green-600', bgColor: 'bg-green-100' },
  expired: { label: 'Expired', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export const OfferList: React.FC<OfferListProps> = ({
  offers,
  onDownload,
  onResend,
  onCopyLink,
  onViewDetails,
  onUpdateStatus,
  isLoading = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<OfferStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort offers
  const filteredOffers = offers
    .filter((offer) => {
      if (filterStatus !== 'all' && offer.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          offer.offer_number.toLowerCase().includes(query) ||
          offer.customer?.name.toLowerCase().includes(query) ||
          offer.unit?.unit_number.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'price':
          comparison = a.price_quoted - b.price_quoted;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const getDaysUntilExpiry = (validUntil: string) => {
    const days = Math.ceil(
      (new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  // Stats
  const stats = {
    total: offers.length,
    draft: offers.filter((o) => o.status === 'draft').length,
    sent: offers.filter((o) => o.status === 'sent').length,
    viewed: offers.filter((o) => o.status === 'viewed').length,
    accepted: offers.filter((o) => o.status === 'accepted').length,
    totalValue: offers
      .filter((o) => o.status !== 'rejected' && o.status !== 'expired')
      .reduce((sum, o) => sum + o.price_quoted, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Offers</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Viewed</p>
          <p className="text-2xl font-bold text-purple-600">{stats.viewed}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pipeline Value</p>
          <p className="text-xl font-bold text-pink-600">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by offer #, customer, or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {(Object.keys(statusConfig) as OfferStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? `${statusConfig[status].bgColor} ${statusConfig[status].color}`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {statusConfig[status].label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(by);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <svg
              className="animate-spin w-8 h-8 mx-auto text-pink-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-slate-500 mt-4">Loading offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800">No offers found</h3>
            <p className="text-slate-500 mt-1">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first offer to get started'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Offer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOffers.map((offer) => {
                const status = statusConfig[offer.status];
                const expired = isExpired(offer.valid_until);
                const daysLeft = getDaysUntilExpiry(offer.valid_until);

                return (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetails(offer)}
                        className="font-medium text-slate-800 hover:text-pink-600 transition-colors"
                      >
                        {offer.offer_number}
                      </button>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(offer.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{offer.customer?.name || 'N/A'}</p>
                      {offer.customer?.phone && (
                        <p className="text-xs text-slate-500">{offer.customer.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{offer.unit?.unit_number || 'N/A'}</p>
                      <p className="text-xs text-slate-500">
                        {offer.unit?.project?.name || 'Laguna Residence'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(offer.price_quoted)}
                      </p>
                      {offer.discount_amount > 0 && (
                        <p className="text-xs text-green-600">
                          -{formatCurrency(offer.discount_amount)} discount
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${expired ? 'text-red-600' : 'text-slate-600'}`}>
                        {formatDate(offer.valid_until)}
                      </p>
                      {!expired && offer.status !== 'accepted' && offer.status !== 'rejected' && (
                        <p className={`text-xs ${daysLeft <= 3 ? 'text-orange-500' : 'text-slate-500'}`}>
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </p>
                      )}
                      {expired && offer.status !== 'accepted' && (
                        <p className="text-xs text-red-500">Expired</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        {/* Download */}
                        <button
                          onClick={() => onDownload(offer)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={() => onCopyLink(offer)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Copy Link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>

                        {/* Resend */}
                        {(offer.status === 'sent' || offer.status === 'viewed') && !expired && (
                          <button
                            onClick={() => onResend(offer)}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Resend"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </button>
                        )}

                        {/* Status Dropdown */}
                        <div className="relative group">
                          <button
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Change Status"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              {(Object.keys(statusConfig) as OfferStatus[]).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => onUpdateStatus(offer.id, s)}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                                    offer.status === s ? 'bg-slate-100' : ''
                                  }`}
                                >
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusConfig[s].bgColor}`} />
                                  {statusConfig[s].label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination placeholder */}
      {filteredOffers.length > 0 && (
        <div className="flex justify-between items-center text-sm text-slate-500">
          <p>Showing {filteredOffers.length} of {offers.length} offers</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferList;
