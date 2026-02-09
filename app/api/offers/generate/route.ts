import { NextRequest, NextResponse } from 'next/server';
import { generateOfferPDF, generateOfferNumber, calculateValidUntil, getDefaultPaymentPlans } from '../../../../lib/pdf/generateOfferPDF';
import { Offer, Unit, Customer, User, PaymentPlan, Project } from '../../../../types';

interface GenerateOfferRequest {
  unit_id: string;
  customer_id: string;
  agent_id: string;
  price: number;
  discount_amount?: number;
  discount_reason?: string;
  payment_plan_id: string;
  valid_days?: number;
  notes?: string;
}

// Mock data - replace with Supabase queries
const mockProjects: Record<string, Project> = {
  'proj-001': {
    id: 'proj-001',
    org_id: 'org-001',
    name: 'Laguna Residence',
    slug: 'laguna-residence',
    location: 'Al Reem Island, Abu Dhabi',
    country: 'UAE',
    total_units: 250,
    launch_date: '2024-01-15',
    completion_date: '2026-12-31',
    status: 'active',
    gallery_urls: [],
    amenities: ['Swimming Pool', 'Gym', 'Spa', 'Lounge'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const mockUnits: Record<string, Unit> = {
  'unit-001': {
    id: 'unit-001',
    project_id: 'proj-001',
    project: mockProjects['proj-001'],
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
    status: 'available',
    is_corner: false,
    balcony_sqft: 25,
    unit_images: [],
    features: ['Balcony', 'Sea View', 'Parking'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const mockCustomers: Record<string, Customer> = {
  'cust-001': {
    id: 'cust-001',
    org_id: 'org-001',
    name: 'Ahmed Al Maktoum',
    email: 'ahmed@example.com',
    phone: '+971 50 123 4567',
    nationality: 'UAE',
    source: 'referral',
    lead_score: 85,
    lead_status: 'qualified',
    tags: ['VIP', 'Cash'],
    assigned_agent_id: 'agent-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const mockAgents: Record<string, User> = {
  'agent-001': {
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
  },
};

// In-memory offer storage (replace with Supabase)
const offersStore: Map<string, Offer> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: GenerateOfferRequest = await request.json();

    // Validate required fields
    if (!body.unit_id || !body.customer_id || !body.price || !body.payment_plan_id || !body.agent_id) {
      return NextResponse.json(
        { error: 'Missing required fields: unit_id, customer_id, price, payment_plan_id, agent_id' },
        { status: 400 }
      );
    }

    // Fetch data (mock for now - replace with Supabase)
    const unit = mockUnits[body.unit_id];
    const customer = mockCustomers[body.customer_id];
    const agent = mockAgents[body.agent_id];
    const paymentPlans = getDefaultPaymentPlans();
    const paymentPlan = paymentPlans.find((p) => p.id === body.payment_plan_id);

    // Validate all entities exist
    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    if (!paymentPlan) {
      return NextResponse.json({ error: 'Payment plan not found' }, { status: 404 });
    }

    // Generate offer number and validity
    const offerNumber = generateOfferNumber();
    const validUntil = calculateValidUntil(body.valid_days || 7);
    const createdAt = new Date().toISOString();

    // Create offer record
    const offer: Offer = {
      id: `offer-${Date.now()}`,
      unit_id: body.unit_id,
      unit,
      customer_id: body.customer_id,
      customer,
      agent_id: body.agent_id,
      agent,
      offer_number: offerNumber,
      price_quoted: body.price,
      discount_amount: body.discount_amount || 0,
      payment_plan_id: body.payment_plan_id,
      valid_until: validUntil,
      status: 'draft',
      created_at: createdAt,
    };

    // Generate PDF
    const pdfData = {
      offer: {
        offer_number: offerNumber,
        price_quoted: body.price,
        discount_amount: body.discount_amount || 0,
        valid_until: validUntil,
        notes: body.notes,
        created_at: createdAt,
      },
      unit,
      customer,
      agent,
      paymentPlan,
    };

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateOfferPDF(pdfData);
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to generate PDF', details: String(pdfError) },
        { status: 500 }
      );
    }

    // In production: Upload to Supabase Storage and get URL
    // For now, we'll return the PDF as base64
    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfUrl = `data:application/pdf;base64,${pdfBase64}`;
    
    // Update offer with PDF URL
    offer.pdf_url = pdfUrl;
    offer.status = 'sent';

    // Store offer (replace with Supabase insert)
    offersStore.set(offer.id, offer);

    // Return response
    return NextResponse.json({
      success: true,
      offer: {
        id: offer.id,
        offer_number: offer.offer_number,
        price_quoted: offer.price_quoted,
        discount_amount: offer.discount_amount,
        valid_until: offer.valid_until,
        status: offer.status,
        created_at: offer.created_at,
        customer: {
          id: customer.id,
          name: customer.name,
        },
        unit: {
          id: unit.id,
          unit_number: unit.unit_number,
          project_name: unit.project?.name,
        },
      },
      pdf_url: pdfUrl,
      download_url: `/api/offers/${offer.id}/download`,
    });
  } catch (error) {
    console.error('Offer generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // List all offers
  const offers = Array.from(offersStore.values()).map((offer) => ({
    id: offer.id,
    offer_number: offer.offer_number,
    price_quoted: offer.price_quoted,
    discount_amount: offer.discount_amount,
    valid_until: offer.valid_until,
    status: offer.status,
    created_at: offer.created_at,
    customer: {
      id: offer.customer?.id,
      name: offer.customer?.name,
      phone: offer.customer?.phone,
    },
    unit: {
      id: offer.unit?.id,
      unit_number: offer.unit?.unit_number,
      project_name: offer.unit?.project?.name,
    },
  }));

  return NextResponse.json({
    success: true,
    offers,
    total: offers.length,
  });
}
