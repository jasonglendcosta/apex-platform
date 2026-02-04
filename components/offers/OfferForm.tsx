'use client';

import React, { useState, useEffect } from 'react';
import { Unit, Customer, PaymentPlan, OfferFormData } from '../../types';

// Mock data - replace with actual API calls
const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    org_id: 'org-001',
    name: 'Ahmed Al Maktoum',
    email: 'ahmed@example.com',
    phone: '+971 50 123 4567',
    nationality: 'UAE',
    source: 'referral',
    lead_score: 85,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cust-002',
    org_id: 'org-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+44 7700 123456',
    nationality: 'UK',
    source: 'website',
    lead_score: 72,
    created_at: new Date().toISOString(),
  },
];

const defaultPaymentPlans: PaymentPlan[] = [
  {
    id: 'pp-60-40',
    org_id: 'default',
    name: '60/40 Payment Plan',
    description: '60% during construction, 40% on handover',
    milestones: [
      { name: 'Booking Deposit', percent: 10, due_days: 0 },
      { name: '1st Installment', percent: 10, due_days: 30 },
      { name: '2nd Installment', percent: 10, due_days: 90 },
      { name: '3rd Installment', percent: 10, due_days: 180 },
      { name: '4th Installment', percent: 10, due_days: 270 },
      { name: '5th Installment', percent: 10, due_days: 360 },
      { name: 'On Handover', percent: 40, due_days: 720 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'pp-80-20',
    org_id: 'default',
    name: '80/20 Payment Plan',
    description: '80% during construction, 20% on handover',
    milestones: [
      { name: 'Booking Deposit', percent: 10, due_days: 0 },
      { name: '1st Installment', percent: 10, due_days: 30 },
      { name: '2nd Installment', percent: 15, due_days: 90 },
      { name: '3rd Installment', percent: 15, due_days: 180 },
      { name: '4th Installment', percent: 15, due_days: 270 },
      { name: '5th Installment', percent: 15, due_days: 360 },
      { name: 'On Handover', percent: 20, due_days: 720 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'pp-post-handover',
    org_id: 'default',
    name: 'Post-Handover Plan',
    description: '50% construction, 50% post-handover over 3 years',
    milestones: [
      { name: 'Booking Deposit', percent: 10, due_days: 0 },
      { name: '1st Installment', percent: 10, due_days: 90 },
      { name: '2nd Installment', percent: 10, due_days: 180 },
      { name: '3rd Installment', percent: 10, due_days: 360 },
      { name: 'On Handover', percent: 10, due_days: 540 },
      { name: 'Post-Handover 1', percent: 10, due_days: 720 },
      { name: 'Post-Handover 2', percent: 10, due_days: 900 },
      { name: 'Post-Handover 3', percent: 10, due_days: 1080 },
      { name: 'Post-Handover 4', percent: 10, due_days: 1260 },
      { name: 'Final Payment', percent: 10, due_days: 1440 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'pp-cash',
    org_id: 'default',
    name: 'Cash Payment',
    description: 'Full payment within 30 days',
    milestones: [
      { name: 'Booking Deposit', percent: 10, due_days: 0 },
      { name: 'Balance Payment', percent: 90, due_days: 30 },
    ],
    created_at: new Date().toISOString(),
  },
];

interface OfferFormProps {
  unit: Unit;
  onSubmit: (data: OfferFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  paymentPlans?: PaymentPlan[];
  customers?: Customer[];
}

export const OfferForm: React.FC<OfferFormProps> = ({
  unit,
  onSubmit,
  onCancel,
  isLoading = false,
  paymentPlans = defaultPaymentPlans,
  customers = mockCustomers,
}) => {
  // Form state
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
  });
  const [price, setPrice] = useState(unit.current_price);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(paymentPlans[0]?.id || '');
  const [validDays, setValidDays] = useState(7);
  const [notes, setNotes] = useState('');

  // Computed values
  const finalPrice = price - discountAmount;
  const discountPercentage = price > 0 ? ((discountAmount / price) * 100).toFixed(1) : '0';
  const pricePerSqft = Math.round(finalPrice / unit.area_sqft);

  // Validation
  const isValid = () => {
    if (customerType === 'existing' && !selectedCustomerId) return false;
    if (customerType === 'new' && !newCustomer.name) return false;
    if (finalPrice <= 0) return false;
    if (!paymentPlanId) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    const formData: OfferFormData = {
      unit_id: unit.id,
      customer_id: customerType === 'existing' ? selectedCustomerId : undefined,
      new_customer: customerType === 'new' ? newCustomer : undefined,
      price: finalPrice,
      discount_amount: discountAmount,
      discount_reason: discountReason || undefined,
      payment_plan_id: paymentPlanId,
      valid_days: validDays,
      notes: notes || undefined,
    };

    onSubmit(formData);
  };

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Unit Summary Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold">{unit.unit_number}</h3>
            <p className="text-slate-300">{unit.project?.name || 'Laguna Residence'}</p>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            Available
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Bedrooms</span>
            <p className="font-semibold">{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} BR`}</p>
          </div>
          <div>
            <span className="text-slate-400">Area</span>
            <p className="font-semibold">{unit.area_sqft.toLocaleString()} sqft</p>
          </div>
          <div>
            <span className="text-slate-400">Floor</span>
            <p className="font-semibold">{unit.floor}</p>
          </div>
          <div>
            <span className="text-slate-400">View</span>
            <p className="font-semibold capitalize">{unit.view_type}</p>
          </div>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Customer</h4>
        
        {/* Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setCustomerType('existing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              customerType === 'existing'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Existing Customer
          </button>
          <button
            type="button"
            onClick={() => setCustomerType('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              customerType === 'new'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            New Customer
          </button>
        </div>

        {customerType === 'existing' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="Enter customer name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required={customerType === 'new'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="customer@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                value={newCustomer.nationality}
                onChange={(e) => setNewCustomer({ ...newCustomer, nationality: e.target.value })}
                placeholder="e.g., UAE, UK, India"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Pricing</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              List Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">AED</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full pl-14 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">AED</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  min="0"
                  max={price}
                  className="w-full pl-14 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              {discountAmount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {discountPercentage}% discount applied
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Reason
              </label>
              <select
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select reason...</option>
                <option value="Early Bird">Early Bird Offer</option>
                <option value="Bulk Purchase">Bulk Purchase</option>
                <option value="Returning Customer">Returning Customer</option>
                <option value="Referral Bonus">Referral Bonus</option>
                <option value="Promotional">Promotional Offer</option>
                <option value="Negotiated">Negotiated Price</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Price Summary */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">List Price</span>
              <span className="text-slate-800">{formatCurrency(price)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-lg font-semibold text-slate-800">Final Price</span>
              <span className="text-xl font-bold text-pink-600">{formatCurrency(finalPrice)}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2 text-right">
              {formatCurrency(pricePerSqft)} per sqft
            </p>
          </div>
        </div>
      </div>

      {/* Payment Plan */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Payment Plan</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {paymentPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setPaymentPlanId(plan.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                paymentPlanId === plan.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <h5 className="font-semibold text-slate-800">{plan.name}</h5>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              <p className="text-xs text-slate-400 mt-2">
                {plan.milestones.length} milestones
              </p>
            </button>
          ))}
        </div>

        {/* Show selected plan milestones */}
        {paymentPlanId && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h5 className="font-medium text-slate-700 mb-3">Payment Schedule</h5>
            <div className="space-y-2">
              {paymentPlans
                .find((p) => p.id === paymentPlanId)
                ?.milestones.map((milestone, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {milestone.name} ({milestone.percent}%)
                    </span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(Math.round(finalPrice * (milestone.percent / 100)))}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Validity & Notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Offer Details</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Offer Valid For
            </label>
            <select
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valid Until
            </label>
            <input
              type="text"
              value={new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              readOnly
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any special terms, conditions, or notes for this offer..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid() || isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isValid() && !isLoading
              ? 'bg-pink-500 text-white hover:bg-pink-600'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Preview Offer'
          )}
        </button>
      </div>
    </form>
  );
};

export default OfferForm;
