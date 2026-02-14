-- APEX Platform Database Schema for Supabase

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Organizations (Property Developers)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D86DCB',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Buildings/Developments)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  total_units INTEGER,
  launch_date DATE,
  completion_date DATE,
  description TEXT,
  hero_image_url TEXT,
  model_3d_url TEXT,
  status TEXT DEFAULT 'active', -- active, sold_out, upcoming
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Agents, Admins, Managers)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent', -- admin, manager, agent, viewer
  phone TEXT,
  avatar_url TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 2.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units (Individual Properties)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  area_sqft NUMERIC(10,2),
  area_sqm NUMERIC(10,2),
  base_price NUMERIC(15,2),
  current_price NUMERIC(15,2),
  price_per_sqft NUMERIC(10,2),
  view_type TEXT, -- sea, garden, pool, city, park
  unit_type TEXT DEFAULT 'apartment', -- studio, 1br, 2br, 3br, penthouse, townhouse
  aspect TEXT, -- N, S, E, W, NE, NW, SE, SW
  floor_plan_url TEXT,
  status TEXT DEFAULT 'available', -- available, reserved, booked, spa_signed, spa_executed, registered, sold
  reserved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reserved_at TIMESTAMPTZ,
  reservation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (Buyers)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT,
  emirates_id TEXT,
  address TEXT,
  source TEXT DEFAULT 'walk_in', -- walk_in, website, referral, broker, social_media
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_score INTEGER DEFAULT 50, -- 0-100 AI-generated
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Plans
CREATE TABLE payment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  milestones JSONB, -- [{name: "Booking", percent: 10, due_days: 0}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations (Deal Tracking)
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'reserved', -- reserved, booked, spa_pending, spa_signed, spa_executed, registered, cancelled
  reservation_date TIMESTAMPTZ DEFAULT NOW(),
  booking_date TIMESTAMPTZ,
  spa_date TIMESTAMPTZ,
  registration_date TIMESTAMPTZ,
  handover_date TIMESTAMPTZ,
  sale_price NUMERIC(15,2),
  discount_amount NUMERIC(15,2) DEFAULT 0,
  discount_reason TEXT,
  payment_plan_id UUID REFERENCES payment_plans(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Individual Payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  milestone_name TEXT,
  amount NUMERIC(15,2),
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending', -- pending, paid, overdue
  payment_method TEXT, -- bank_transfer, cheque, card
  reference_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (Generated PDFs)
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  offer_number TEXT UNIQUE,
  pdf_url TEXT,
  price_quoted NUMERIC(15,2),
  valid_until DATE,
  status TEXT DEFAULT 'sent', -- draft, sent, viewed, accepted, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log (Audit Trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price History (For Analytics)
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  old_price NUMERIC(15,2),
  new_price NUMERIC(15,2),
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_customers_agent ON customers(assigned_agent_id);
CREATE INDEX idx_activity_org ON activity_log(org_id, created_at DESC);
CREATE INDEX idx_units_reserved_by ON units(reserved_by);
CREATE INDEX idx_reservations_unit ON reservations(unit_id);
CREATE INDEX idx_projects_org ON projects(org_id);

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Seed Data for One Development (Laguna Residence)
INSERT INTO organizations (name, primary_color) 
VALUES ('One Development', '#D86DCB') 
RETURNING id as org_id;

-- After getting org_id, insert projects and sample data
-- This will be handled by migration script
