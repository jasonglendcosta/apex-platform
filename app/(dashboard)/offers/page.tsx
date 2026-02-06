'use client';

import React, { useState, useEffect } from 'react';
import { OfferForm } from '../../../components/offers/OfferForm';
import { OfferPreview } from '../../../components/offers/OfferPreview';
import { OfferList } from '../../../components/offers/OfferList';
import { Unit, Customer, User, PaymentPlan, OfferFormData, Offer, OfferStatus } from '../../../types';

// Mock data - replace with API calls
const mockUnit: Unit = {
  id: 'unit-001',
  project_id: 'proj-001',
  project: {
    id: 'proj-001',
    org_id: 'org-001',
    name: 'Laguna Residence',
    slug: 'laguna-residence',
    location: 'Al Reem Island, Abu Dhabi',
    city: 'Abu Dhabi',
    country: 'UAE',
    total_units: 250,
    status: 'active',
    gallery_urls: [],
    amenities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  unit_number: 'LR-0501',
  floor: 5,
  bedrooms: 2,
  bathrooms: 2.5,
  area_sqft: 1250,
  area_sqm: 116,
  base_price: 1650000,
  current_price: 1650000,
  price_per_sqft: 1320,
  view_type: 'sea',
  unit_type: '2br',
  aspect: 'NE',
  is_corner: false,
  balcony_sqft: 120,
  unit_images: [],
  features: ['Sea View', 'Balcony', 'High Floor'],
  status: 'available',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockCustomer: Customer = {
  id: 'cust-001',
  org_id: 'org-001',
  name: 'Ahmed Al Maktoum',
  email: 'ahmed@example.com',
  phone: '+971 50 123 4567',
  nationality: 'UAE',
  source: 'referral',
  lead_score: 85,
  lead_status: 'negotiating',
  tags: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockAgent: User = {
  id: 'agent-001',
  org_id: 'org-001',
  email: 'jason@onedevelopment.ae',
  name: 'Jason D Costa',
  role: 'agent',
  phone: '+971 50 987 6543',
  commission_rate: 2.0,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockPaymentPlans: PaymentPlan[] = [
  {
    id: 'pp-60-40',
    org_id: 'default',
    name: '60/40 Payment Plan',
    description: '60% during construction, 40% on handover',
    is_default: true,
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
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pp-80-20',
    org_id: 'default',
    name: '80/20 Payment Plan',
    description: '80% during construction, 20% on handover',
    is_default: false,
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
    updated_at: new Date().toISOString(),
  },
];

// Mock offers for list view
const generateMockOffers = (): Offer[] => [
  {
    id: 'offer-001',
    unit_id: 'unit-001',
    unit: mockUnit,
    customer_id: 'cust-001',
    customer: mockCustomer,
    agent_id: 'agent-001',
    agent: mockAgent,
    offer_number: 'OFF-20250204-0001',
    price_quoted: 1550000,
    discount_amount: 100000,
    payment_plan_id: 'pp-60-40',
    payment_plan: mockPaymentPlans[0],
    valid_until: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'offer-002',
    unit_id: 'unit-002',
    unit: { ...mockUnit, id: 'unit-002', unit_number: 'LR-0701', floor: 7 },
    customer_id: 'cust-002',
    customer: { ...mockCustomer, id: 'cust-002', name: 'Sarah Johnson', nationality: 'UK' },
    agent_id: 'agent-001',
    agent: mockAgent,
    offer_number: 'OFF-20250203-0002',
    price_quoted: 1800000,
    discount_amount: 0,
    payment_plan_id: 'pp-80-20',
    payment_plan: mockPaymentPlans[1],
    valid_until: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'viewed',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'offer-003',
    unit_id: 'unit-003',
    unit: { ...mockUnit, id: 'unit-003', unit_number: 'LR-1001', floor: 10, bedrooms: 3, area_sqft: 1800 },
    customer_id: 'cust-003',
    customer: { ...mockCustomer, id: 'cust-003', name: 'Mohammed Hassan', nationality: 'Saudi Arabia' },
    agent_id: 'agent-001',
    agent: mockAgent,
    offer_number: 'OFF-20250201-0003',
    price_quoted: 2750000,
    discount_amount: 50000,
    discount_reason: 'Returning Customer',
    payment_plan_id: 'pp-60-40',
    payment_plan: mockPaymentPlans[0],
    valid_until: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'offer-004',
    unit_id: 'unit-004',
    unit: { ...mockUnit, id: 'unit-004', unit_number: 'LR-PH01', floor: 15, bedrooms: 4, area_sqft: 3500, unit_type: 'penthouse' },
    customer_id: 'cust-004',
    customer: { ...mockCustomer, id: 'cust-004', name: 'Omar Al-Fahim', nationality: 'UAE' },
    agent_id: 'agent-001',
    agent: mockAgent,
    offer_number: 'OFF-20250130-0004',
    price_quoted: 8200000,
    discount_amount: 300000,
    discount_reason: 'Bulk Purchase',
    payment_plan_id: 'pp-80-20',
    payment_plan: mockPaymentPlans[1],
    valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

type ViewMode = 'list' | 'create' | 'preview';

export default function OffersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [offers, setOffers] = useState<Offer[]>(generateMockOffers());
  const [selectedUnit, setSelectedUnit] = useState<Unit>(mockUnit);
  const [formData, setFormData] = useState<OfferFormData | null>(null);
  const [offerNumber, setOfferNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate offer number when entering preview mode
  useEffect(() => {
    if (viewMode === 'preview' && !offerNumber) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setOfferNumber(`OFF-${dateStr}-${random}`);
    }
  }, [viewMode, offerNumber]);

  const handleFormSubmit = (data: OfferFormData) => {
    setFormData(data);
    setViewMode('preview');
  };

  const handleConfirmGenerate = async () => {
    if (!formData) return;

    setIsGenerating(true);

    try {
      // In production, this would call the API
      // const response = await fetch('/api/offers/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     agent_id: mockAgent.id,
      //   }),
      // });
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create mock offer
      const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        unit_id: selectedUnit.id,
        unit: selectedUnit,
        customer_id: formData.customer_id || 'new-customer',
        customer: formData.customer_id
          ? mockCustomer
          : {
              id: 'new-customer',
              org_id: 'org-001',
              name: formData.new_customer?.name || 'New Customer',
              email: formData.new_customer?.email,
              phone: formData.new_customer?.phone,
              nationality: formData.new_customer?.nationality,
              source: 'walk_in',
              lead_score: 50,
              created_at: new Date().toISOString(),
            },
        agent_id: mockAgent.id,
        agent: mockAgent,
        offer_number: offerNumber,
        price_quoted: formData.price,
        discount_amount: formData.discount_amount,
        discount_reason: formData.discount_reason,
        payment_plan_id: formData.payment_plan_id,
        payment_plan: mockPaymentPlans.find((p) => p.id === formData.payment_plan_id),
        valid_until: new Date(Date.now() + formData.valid_days * 24 * 60 * 60 * 1000).toISOString(),
        notes: formData.notes,
        status: 'sent',
        created_at: new Date().toISOString(),
      };

      setOffers([newOffer, ...offers]);

      // Show success and download PDF (mock)
      alert(`Offer ${offerNumber} generated successfully!\nPDF would download in production.`);

      // Reset and go back to list
      setViewMode('list');
      setFormData(null);
      setOfferNumber('');
    } catch (error) {
      console.error('Error generating offer:', error);
      alert('Failed to generate offer. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (offer: Offer) => {
    // In production, download from offer.pdf_url
    alert(`Downloading PDF for offer ${offer.offer_number}...`);
  };

  const handleResend = (offer: Offer) => {
    alert(`Resending offer ${offer.offer_number} to ${offer.customer?.name}...`);
  };

  const handleCopyLink = (offer: Offer) => {
    const link = `${window.location.origin}/offers/view/${offer.id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleViewDetails = (offer: Offer) => {
    alert(`Viewing details for offer ${offer.offer_number}...`);
  };

  const handleUpdateStatus = (offerId: string, status: OfferStatus) => {
    setOffers(
      offers.map((o) => (o.id === offerId ? { ...o, status } : o))
    );
  };

  const getCustomerFromFormData = (): Customer => {
    if (formData?.customer_id) {
      return mockCustomer;
    }
    return {
      id: 'new-customer',
      org_id: 'org-001',
      name: formData?.new_customer?.name || 'New Customer',
      email: formData?.new_customer?.email,
      phone: formData?.new_customer?.phone,
      nationality: formData?.new_customer?.nationality,
      source: 'walk_in',
      lead_score: 50,
      created_at: new Date().toISOString(),
    };
  };

  const getPaymentPlanFromFormData = (): PaymentPlan => {
    return mockPaymentPlans.find((p) => p.id === formData?.payment_plan_id) || mockPaymentPlans[0];
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                ONE
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Offer Generation</h1>
                <p className="text-sm text-slate-500">APEX Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {viewMode === 'list' && (
                <button
                  onClick={() => setViewMode('create')}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Offer
                </button>
              )}
              {(viewMode === 'create' || viewMode === 'preview') && (
                <button
                  onClick={() => {
                    setViewMode('list');
                    setFormData(null);
                    setOfferNumber('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'list' && (
          <OfferList
            offers={offers}
            onDownload={handleDownload}
            onResend={handleResend}
            onCopyLink={handleCopyLink}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {viewMode === 'create' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Create New Offer</h2>
              <p className="text-slate-500 mt-1">Generate a professional PDF offer for your customer</p>
            </div>
            <OfferForm
              unit={selectedUnit}
              onSubmit={handleFormSubmit}
              onCancel={() => setViewMode('list')}
              paymentPlans={mockPaymentPlans}
            />
          </div>
        )}

        {viewMode === 'preview' && formData && (
          <div className="py-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800">Preview Offer</h2>
              <p className="text-slate-500 mt-1">Review the offer details before generating the PDF</p>
            </div>
            <OfferPreview
              unit={selectedUnit}
              customer={getCustomerFromFormData()}
              agent={mockAgent}
              paymentPlan={getPaymentPlanFromFormData()}
              formData={formData}
              offerNumber={offerNumber}
              onConfirm={handleConfirmGenerate}
              onBack={() => setViewMode('create')}
              isGenerating={isGenerating}
            />
          </div>
        )}
      </main>
    </div>
  );
}
