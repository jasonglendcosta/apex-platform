// APEX Platform Type Definitions

export type UnitStatus = 
  | 'available' 
  | 'reserved' 
  | 'booked' 
  | 'spa_signed' 
  | 'spa_executed' 
  | 'registered' 
  | 'sold' 
  | 'blocked';

export type ViewType = 
  | 'sea' 
  | 'garden' 
  | 'pool' 
  | 'city' 
  | 'park' 
  | 'lagoon' 
  | 'canal' 
  | 'community';

export type UnitType = 
  | 'studio' 
  | '1br' 
  | '2br' 
  | '3br' 
  | '4br' 
  | 'penthouse' 
  | 'townhouse' 
  | 'duplex';

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'agent' 
  | 'viewer';

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'viewing_scheduled' 
  | 'negotiating' 
  | 'won' 
  | 'lost' 
  | 'dormant';

export type LeadSource = 
  | 'walk_in' 
  | 'website' 
  | 'referral' 
  | 'broker' 
  | 'social_media' 
  | 'exhibition' 
  | 'cold_call' 
  | 'other';

export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  location?: string;
  city?: string;
  country: string;
  total_units?: number;
  total_floors?: number;
  launch_date?: string;
  completion_date?: string;
  description?: string;
  hero_image_url?: string;
  gallery_urls: string[];
  model_3d_url?: string;
  amenities: string[];
  status: 'upcoming' | 'active' | 'sold_out' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_id?: string;
  org_id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  commission_rate: number;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  project_id: string;
  unit_number: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  area_sqm: number;
  base_price: number;
  current_price: number;
  price_per_sqft: number;
  view_type?: ViewType;
  unit_type?: UnitType;
  aspect?: string;
  is_corner: boolean;
  balcony_sqft: number;
  floor_plan_url?: string;
  unit_images: string[];
  features: string[];
  status: UnitStatus;
  reserved_by?: string;
  reserved_at?: string;
  reservation_expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  project?: Project;
  reserved_by_user?: User;
}

export interface Customer {
  id: string;
  org_id: string;
  name: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  nationality?: string;
  passport_number?: string;
  emirates_id?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  company?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_bedrooms?: number[];
  preferred_floors?: number[];
  preferred_views?: string[];
  source?: LeadSource;
  source_details?: string;
  assigned_agent_id?: string;
  lead_score: number;
  lead_status: LeadStatus;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  assigned_agent?: User;
}

export interface PaymentPlan {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  milestones: PaymentMilestone[];
  created_at: string;
  updated_at: string;
}

export interface PaymentMilestone {
  name: string;
  percent: number;
  due_days: number;
}

export interface Reservation {
  id: string;
  reservation_number: string;
  unit_id: string;
  customer_id: string;
  agent_id?: string;
  status: 'reserved' | 'booked' | 'spa_pending' | 'spa_signed' | 'spa_executed' | 'registered' | 'handed_over' | 'cancelled';
  reservation_date: string;
  booking_date?: string;
  spa_date?: string;
  registration_date?: string;
  handover_date?: string;
  cancellation_date?: string;
  cancellation_reason?: string;
  sale_price: number;
  discount_amount: number;
  discount_percent: number;
  discount_reason?: string;
  discount_approved_by?: string;
  payment_plan_id?: string;
  commission_amount?: number;
  commission_paid: boolean;
  notes?: string;
  documents: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  unit?: Unit;
  customer?: Customer;
  agent?: User;
  payment_plan?: PaymentPlan;
}

export interface Offer {
  id: string;
  offer_number: string;
  unit_id: string;
  customer_id: string;
  agent_id?: string;
  pdf_url?: string;
  price_quoted: number;
  discount_amount: number;
  payment_plan_id?: string;
  valid_until: string;
  cover_letter?: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'superseded';
  sent_at?: string;
  viewed_at?: string;
  response_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  unit?: Unit;
  customer?: Customer;
  agent?: User;
}

export interface Payment {
  id: string;
  reservation_id: string;
  milestone_name: string;
  milestone_percent?: number;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partially_paid' | 'waived';
  payment_method?: 'bank_transfer' | 'cheque' | 'card' | 'cash' | 'mortgage';
  reference_number?: string;
  bank_name?: string;
  cheque_number?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  org_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joined
  user?: User;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_units: number;
  available_units: number;
  reserved_units: number;
  sold_units: number;
  total_value: number;
  sold_value: number;
  pipeline_value: number;
  avg_price_sqft: number;
}

export interface UnitsByStatus {
  status: UnitStatus;
  count: number;
  value: number;
}

export interface SalesVelocity {
  period: string;
  units_sold: number;
  revenue: number;
}

// Filter Types
export interface UnitFilters {
  status?: UnitStatus[];
  bedrooms?: number[];
  floor_min?: number;
  floor_max?: number;
  price_min?: number;
  price_max?: number;
  view_type?: ViewType[];
  unit_type?: UnitType[];
  search?: string;
}

// Offer Types
export type OfferStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'superseded';

export interface OfferFormData {
  unit_id: string;
  customer_id: string;
  price: number;
  discount_percentage: number;
  payment_plan_id: string;
  valid_until: string;
  notes?: string;
}
