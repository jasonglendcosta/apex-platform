'use client';

import React from 'react';
import { Unit, Customer, User, PaymentPlan, OfferFormData } from '../../types';

interface OfferPreviewProps {
  unit: Unit;
  customer: Customer;
  agent: User;
  paymentPlan: PaymentPlan;
  formData: OfferFormData;
  offerNumber: string;
  onConfirm: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export const OfferPreview: React.FC<OfferPreviewProps> = ({
  unit,
  customer,
  agent,
  paymentPlan,
  formData,
  offerNumber,
  onConfirm,
  onBack,
  isGenerating = false,
}) => {
  const finalPrice = formData.price;
  const discountAmount = formData.discount_amount || 0;
  const originalPrice = finalPrice + discountAmount;
  const pricePerSqft = Math.round(finalPrice / unit.area_sqft);

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + formData.valid_days);

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getBedroomLabel = (bedrooms: number) => {
    if (bedrooms === 0) return 'Studio';
    if (bedrooms === 1) return '1 Bedroom';
    return `${bedrooms} Bedrooms`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center font-bold">
                ONE
              </div>
              <div>
                <h2 className="text-xl font-bold">Property Offer</h2>
                <p className="text-slate-300 text-sm">#{offerNumber}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">
              Preview Mode
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer & Unit Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Prepared For</h3>
            <p className="text-lg font-semibold text-slate-800">{customer.name}</p>
            {customer.email && (
              <p className="text-sm text-slate-600">{customer.email}</p>
            )}
            {customer.phone && (
              <p className="text-sm text-slate-600">{customer.phone}</p>
            )}
            {customer.nationality && (
              <p className="text-sm text-slate-500 mt-1">{customer.nationality}</p>
            )}
          </div>

          {/* Unit Card */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Property</h3>
            <p className="text-lg font-semibold text-slate-800">{unit.unit_number}</p>
            <p className="text-sm text-slate-600">{unit.project?.name || 'Laguna Residence'}</p>
            <p className="text-sm text-slate-500 mt-1">
              {getBedroomLabel(unit.bedrooms)} • {unit.area_sqft.toLocaleString()} sqft • Floor {unit.floor}
            </p>
          </div>
        </div>

        {/* Unit Specifications */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Unit Specifications</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-slate-500">Unit Number</span>
                <p className="font-semibold text-slate-800">{unit.unit_number}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Floor</span>
                <p className="font-semibold text-slate-800">{unit.floor}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Bedrooms</span>
                <p className="font-semibold text-slate-800">{getBedroomLabel(unit.bedrooms)}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Bathrooms</span>
                <p className="font-semibold text-slate-800">{unit.bathrooms}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Area (Sq.Ft)</span>
                <p className="font-semibold text-slate-800">{unit.area_sqft.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Area (Sq.M)</span>
                <p className="font-semibold text-slate-800">
                  {unit.area_sqm?.toLocaleString() || Math.round(unit.area_sqft * 0.0929).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">View</span>
                <p className="font-semibold text-slate-800 capitalize">{unit.view_type}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Type</span>
                <p className="font-semibold text-slate-800 uppercase">{unit.unit_type}</p>
              </div>
            </div>

            {/* Floor Plan Placeholder */}
            <div className="mt-4 p-6 bg-slate-100 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500">Floor Plan will be included in PDF</p>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Pricing Details</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Base Price</span>
                <span className="text-slate-800">{formatCurrency(originalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 text-green-600">
                  <span>
                    Discount
                    {formData.discount_reason && (
                      <span className="text-slate-500 ml-1">({formData.discount_reason})</span>
                    )}
                  </span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 bg-pink-500 -mx-4 px-4 text-white rounded-lg mt-2">
                <span className="font-semibold">Total Price</span>
                <span className="text-xl font-bold">{formatCurrency(finalPrice)}</span>
              </div>
              <div className="text-right text-sm text-slate-500">
                {formatCurrency(pricePerSqft)} per sqft
              </div>
            </div>
          </div>
        </div>

        {/* Payment Plan */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">{paymentPlan.name}</h3>
            {paymentPlan.description && (
              <p className="text-sm text-slate-500">{paymentPlan.description}</p>
            )}
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Milestone</th>
                  <th className="pb-2 text-center">%</th>
                  <th className="pb-2 text-center">Due</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentPlan.milestones.map((milestone, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-100 ${
                      index % 2 === 1 ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-3 text-slate-700">{milestone.name}</td>
                    <td className="py-3 text-center text-slate-600">{milestone.percent}%</td>
                    <td className="py-3 text-center text-slate-600">
                      {milestone.due_days === 0 ? 'On Booking' : `${milestone.due_days} days`}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatCurrency(Math.round(finalPrice * (milestone.percent / 100)))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {formData.notes && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Additional Notes</h3>
            </div>
            <div className="p-4">
              <p className="text-slate-600 whitespace-pre-wrap">{formData.notes}</p>
            </div>
          </div>
        )}

        {/* Validity & Agent Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-amber-800">Offer Validity</h3>
            </div>
            <p className="text-amber-700">Valid until {formatDate(validUntil)}</p>
            <p className="text-sm text-amber-600 mt-1">{formData.valid_days} days from today</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 text-white">
            <h3 className="text-sm text-slate-400 mb-2">Your Sales Consultant</h3>
            <p className="font-semibold">{agent.name}</p>
            <p className="text-sm text-pink-400">
              {agent.role === 'agent' ? 'Sales Consultant' : agent.role}
            </p>
            {agent.phone && (
              <p className="text-sm text-slate-300 mt-2">📱 {agent.phone}</p>
            )}
            {agent.email && (
              <p className="text-sm text-slate-300">✉️ {agent.email}</p>
            )}
          </div>
        </div>

        {/* PDF Preview Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-800">PDF Generation Preview</h4>
              <p className="text-sm text-blue-600 mt-1">
                The generated PDF will include One Development branding, a personalized cover letter,
                detailed floor plans (when available), full terms & conditions, and professional formatting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors flex items-center"
          disabled={isGenerating}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Edit
        </button>
        <button
          onClick={onConfirm}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
            isGenerating
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate & Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OfferPreview;
