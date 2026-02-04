import { createClient } from '@supabase/supabase-js';

// These would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Types for database tables
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          primary_color: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          location: string | null;
          total_units: number | null;
          launch_date: string | null;
          completion_date: string | null;
          description: string | null;
          hero_image_url: string | null;
          model_3d_url: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      units: {
        Row: {
          id: string;
          project_id: string;
          unit_number: string;
          floor: number;
          bedrooms: number;
          bathrooms: number;
          area_sqft: number;
          area_sqm: number | null;
          base_price: number;
          current_price: number;
          price_per_sqft: number | null;
          view_type: string | null;
          unit_type: string | null;
          aspect: string | null;
          floor_plan_url: string | null;
          status: string;
          reserved_by: string | null;
          reserved_at: string | null;
          reservation_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['units']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['units']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          nationality: string | null;
          passport_number: string | null;
          emirates_id: string | null;
          address: string | null;
          source: string | null;
          assigned_agent_id: string | null;
          lead_score: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      offers: {
        Row: {
          id: string;
          unit_id: string;
          customer_id: string;
          agent_id: string;
          offer_number: string;
          pdf_url: string | null;
          price_quoted: number;
          discount_amount: number;
          discount_reason: string | null;
          payment_plan_id: string | null;
          valid_until: string;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['offers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['offers']['Insert']>;
      };
      payment_plans: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          description: string | null;
          milestones: {
            name: string;
            percent: number;
            due_days: number;
          }[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payment_plans']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payment_plans']['Insert']>;
      };
    };
  };
}

// Helper functions for common database operations

/**
 * Get unit by ID with project details
 */
export async function getUnitWithProject(unitId: string) {
  const { data, error } = await supabase
    .from('units')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('id', unitId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new customer
 */
export async function createCustomer(customer: Database['public']['Tables']['customers']['Insert']) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all payment plans for an organization
 */
export async function getPaymentPlans(orgId: string) {
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*')
    .eq('org_id', orgId);

  if (error) throw error;
  return data;
}

/**
 * Create a new offer
 */
export async function createOffer(offer: Database['public']['Tables']['offers']['Insert']) {
  const { data, error } = await supabase
    .from('offers')
    .insert(offer)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all offers with related data
 */
export async function getOffers(orgId: string, options?: { limit?: number; status?: string }) {
  let query = supabase
    .from('offers')
    .select(`
      *,
      unit:units(*,project:projects(*)),
      customer:customers(*),
      agent:users(*)
    `)
    .order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Update offer status
 */
export async function updateOfferStatus(offerId: string, status: string) {
  const { data, error } = await supabase
    .from('offers')
    .update({ status })
    .eq('id', offerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update offer PDF URL after generation
 */
export async function updateOfferPdfUrl(offerId: string, pdfUrl: string) {
  const { data, error } = await supabase
    .from('offers')
    .update({ pdf_url: pdfUrl })
    .eq('id', offerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload PDF to Supabase Storage
 */
export async function uploadOfferPdf(offerId: string, pdfBuffer: Buffer): Promise<string> {
  const fileName = `offers/${offerId}.pdf`;
  
  const { data, error } = await supabaseAdmin
    .storage
    .from('documents')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabaseAdmin
    .storage
    .from('documents')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export default supabase;
