-- APEX Platform Database Schema
-- Full schema for Property Sales Intelligence Platform
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Organizations (Property Developers)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D86DCB',
  secondary_color TEXT DEFAULT '#0a0a0f',
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Buildings/Developments)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  location TEXT,
  city TEXT,
  country TEXT DEFAULT 'UAE',
  total_units INTEGER,
  total_floors INTEGER,
  launch_date DATE,
  completion_date DATE,
  description TEXT,
  hero_image_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  model_3d_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'sold_out', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Agents, Admins, Managers)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- Links to Supabase Auth
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'manager', 'agent', 'viewer')),
  phone TEXT,
  avatar_url TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 2.00,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Plans (Must be created before units reference it)
CREATE TABLE payment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [{"name": "Booking", "percent": 10, "due_days": 0}, {"name": "1st Installment", "percent": 10, "due_days": 90}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units (Individual Properties)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms NUMERIC(3,1) DEFAULT 1,
  area_sqft NUMERIC(10,2) NOT NULL,
  area_sqm NUMERIC(10,2) GENERATED ALWAYS AS (area_sqft * 0.092903) STORED,
  base_price NUMERIC(15,2) NOT NULL,
  current_price NUMERIC(15,2) NOT NULL,
  price_per_sqft NUMERIC(10,2) GENERATED ALWAYS AS (current_price / NULLIF(area_sqft, 0)) STORED,
  view_type TEXT CHECK (view_type IN ('sea', 'garden', 'pool', 'city', 'park', 'lagoon', 'canal', 'community')),
  unit_type TEXT CHECK (unit_type IN ('studio', '1br', '2br', '3br', '4br', 'penthouse', 'townhouse', 'duplex')),
  aspect TEXT CHECK (aspect IN ('N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW')),
  is_corner BOOLEAN DEFAULT false,
  balcony_sqft NUMERIC(10,2) DEFAULT 0,
  floor_plan_url TEXT,
  unit_images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'booked', 'spa_signed', 'spa_executed', 'registered', 'sold', 'blocked')),
  reserved_by UUID REFERENCES users(id),
  reserved_at TIMESTAMPTZ,
  reservation_expires_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, unit_number)
);

-- Customers (Buyers/Leads)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  nationality TEXT,
  passport_number TEXT,
  emirates_id TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  occupation TEXT,
  company TEXT,
  budget_min NUMERIC(15,2),
  budget_max NUMERIC(15,2),
  preferred_bedrooms INTEGER[],
  preferred_floors INTEGER[],
  preferred_views TEXT[],
  source TEXT CHECK (source IN ('walk_in', 'website', 'referral', 'broker', 'social_media', 'exhibition', 'cold_call', 'other')),
  source_details TEXT,
  assigned_agent_id UUID REFERENCES users(id),
  lead_score INTEGER DEFAULT 50 CHECK (lead_score >= 0 AND lead_score <= 100),
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'viewing_scheduled', 'negotiating', 'won', 'lost', 'dormant')),
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations (Deal Tracking)
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_number TEXT UNIQUE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'booked', 'spa_pending', 'spa_signed', 'spa_executed', 'registered', 'handed_over', 'cancelled')),
  reservation_date TIMESTAMPTZ DEFAULT NOW(),
  booking_date TIMESTAMPTZ,
  spa_date TIMESTAMPTZ,
  registration_date TIMESTAMPTZ,
  handover_date TIMESTAMPTZ,
  cancellation_date TIMESTAMPTZ,
  cancellation_reason TEXT,
  sale_price NUMERIC(15,2) NOT NULL,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_reason TEXT,
  discount_approved_by UUID REFERENCES users(id),
  payment_plan_id UUID REFERENCES payment_plans(id),
  commission_amount NUMERIC(15,2),
  commission_paid BOOLEAN DEFAULT false,
  notes TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Individual Payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  milestone_percent NUMERIC(5,2),
  amount NUMERIC(15,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partially_paid', 'waived')),
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cheque', 'card', 'cash', 'mortgage')),
  reference_number TEXT,
  bank_name TEXT,
  cheque_number TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (Generated PDFs)
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_number TEXT UNIQUE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),
  pdf_url TEXT,
  price_quoted NUMERIC(15,2) NOT NULL,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  payment_plan_id UUID REFERENCES payment_plans(id),
  valid_until DATE NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'superseded')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log (Audit Trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price History (For Analytics)
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  old_price NUMERIC(15,2),
  new_price NUMERIC(15,2) NOT NULL,
  change_percent NUMERIC(5,2),
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Interactions
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'viewing', 'whatsapp', 'sms', 'note')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  duration_minutes INTEGER,
  outcome TEXT,
  follow_up_date DATE,
  follow_up_notes TEXT,
  unit_id UUID REFERENCES units(id), -- If viewing a specific unit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unit Interests (Which customers are interested in which units)
CREATE TABLE unit_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  interest_level TEXT DEFAULT 'medium' CHECK (interest_level IN ('low', 'medium', 'high', 'very_high')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(unit_id, customer_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_floor ON units(floor);
CREATE INDEX idx_units_bedrooms ON units(bedrooms);
CREATE INDEX idx_units_view_type ON units(view_type);
CREATE INDEX idx_units_price ON units(current_price);
CREATE INDEX idx_units_reserved_by ON units(reserved_by) WHERE reserved_by IS NOT NULL;

CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_unit ON reservations(unit_id);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_agent ON reservations(agent_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);

CREATE INDEX idx_customers_org ON customers(org_id);
CREATE INDEX idx_customers_agent ON customers(assigned_agent_id);
CREATE INDEX idx_customers_status ON customers(lead_status);
CREATE INDEX idx_customers_score ON customers(lead_score DESC);

CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_unit ON offers(unit_id);
CREATE INDEX idx_offers_customer ON offers(customer_id);

CREATE INDEX idx_activity_org ON activity_log(org_id, created_at DESC);
CREATE INDEX idx_activity_user ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);

CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_date ON interactions(created_at DESC);

CREATE INDEX idx_price_history_unit ON price_history(unit_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trigger_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_payment_plans_updated_at BEFORE UPDATE ON payment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Track price changes
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.current_price IS DISTINCT FROM NEW.current_price THEN
    INSERT INTO price_history (unit_id, old_price, new_price, change_percent)
    VALUES (
      NEW.id,
      OLD.current_price,
      NEW.current_price,
      ROUND(((NEW.current_price - OLD.current_price) / NULLIF(OLD.current_price, 0)) * 100, 2)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_unit_price_change AFTER UPDATE ON units FOR EACH ROW EXECUTE FUNCTION log_price_change();

-- Sync unit status with reservation
CREATE OR REPLACE FUNCTION sync_unit_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE units SET 
      status = NEW.status,
      updated_at = NOW()
    WHERE id = NEW.unit_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status = 'cancelled') THEN
    UPDATE units SET 
      status = 'available',
      reserved_by = NULL,
      reserved_at = NULL,
      reservation_expires_at = NULL,
      updated_at = NOW()
    WHERE id = COALESCE(NEW.unit_id, OLD.unit_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_unit_status AFTER INSERT OR UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION sync_unit_status();

-- Generate offer number
CREATE OR REPLACE FUNCTION generate_offer_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  seq_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(offer_number FROM 4) AS INTEGER)), 0) + 1 
  INTO seq_num 
  FROM offers 
  WHERE offer_number LIKE 'OF' || year_prefix || '%';
  
  NEW.offer_number := 'OF' || year_prefix || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_offer_number BEFORE INSERT ON offers FOR EACH ROW WHEN (NEW.offer_number IS NULL) EXECUTE FUNCTION generate_offer_number();

-- Generate reservation number
CREATE OR REPLACE FUNCTION generate_reservation_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  seq_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(reservation_number FROM 4) AS INTEGER)), 0) + 1 
  INTO seq_num 
  FROM reservations 
  WHERE reservation_number LIKE 'RS' || year_prefix || '%';
  
  NEW.reservation_number := 'RS' || year_prefix || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_reservation_number BEFORE INSERT ON reservations FOR EACH ROW WHEN (NEW.reservation_number IS NULL) EXECUTE FUNCTION generate_reservation_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Policies (users can only see their org's data)
-- Note: In production, implement proper policies. For now, allow authenticated users.

CREATE POLICY "Enable read for authenticated users" ON organizations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read for authenticated users" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON users FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON units FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON offers FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON activity_log FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON payment_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON interactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON unit_interests FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON price_history FOR SELECT TO authenticated USING (true);

-- =====================================================
-- REAL-TIME SUBSCRIPTIONS
-- =====================================================

-- Enable real-time for units (for live inventory updates)
ALTER PUBLICATION supabase_realtime ADD TABLE units;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE offers;
