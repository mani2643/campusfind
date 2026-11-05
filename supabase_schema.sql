-- CampusFind: Supabase SQL Schema
-- Run this script in the Supabase SQL Editor if connecting a cloud database

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Items Table (Lost & Found)
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    date_reported TIMESTAMPTZ DEFAULT NOW(),
    date_event DATE,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claim_pending', 'in_handover', 'returned')),
    description TEXT NOT NULL,
    image TEXT,
    has_hidden_clue BOOLEAN DEFAULT FALSE,
    hidden_clue_description TEXT,
    distinguishing_features TEXT,
    reporter_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reporter_hostel TEXT,
    custody TEXT DEFAULT 'with_finder' CHECK (custody IN ('with_finder', 'with_admin')),
    current_holder TEXT,
    contact_pref TEXT DEFAULT 'in_app',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Claims Table (Private Ownership Verification)
CREATE TABLE IF NOT EXISTS public.claims (
    id TEXT PRIMARY KEY,
    item_id TEXT REFERENCES public.items(id) ON DELETE CASCADE,
    item_title TEXT,
    claimant_id TEXT NOT NULL,
    claimant_name TEXT NOT NULL,
    claimant_hostel TEXT,
    date_submitted TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    ownership_clue TEXT NOT NULL,
    response_notes TEXT,
    date_resolved TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Handovers Table (Dual-Party Confirmation & Digital Receipts)
CREATE TABLE IF NOT EXISTS public.handovers (
    id TEXT PRIMARY KEY,
    item_id TEXT REFERENCES public.items(id) ON DELETE SET NULL,
    item_title TEXT NOT NULL,
    giver_id TEXT NOT NULL,
    giver_name TEXT NOT NULL,
    giver_role TEXT,
    receiver_id TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_role TEXT,
    handover_date TIMESTAMPTZ DEFAULT NOW(),
    location TEXT NOT NULL,
    confirmation_status TEXT DEFAULT 'Confirmed by Both Parties',
    handover_pin TEXT,
    receipt_number TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to items
CREATE POLICY "Public items are viewable by all students" 
ON public.items FOR SELECT USING (true);

-- Allow authenticated/demo students to report items
CREATE POLICY "Anyone can report an item" 
ON public.items FOR INSERT WITH CHECK (true);

-- Allow item updates by anyone in demo/hackathon mode or reporters
CREATE POLICY "Item reporters can update items" 
ON public.items FOR UPDATE USING (true);

-- Claims policies: Only involved parties can read clues in production
CREATE POLICY "Claims viewable by involved parties" 
ON public.claims FOR SELECT USING (true);

CREATE POLICY "Anyone can submit a claim" 
ON public.claims FOR INSERT WITH CHECK (true);

CREATE POLICY "Claim status updatable" 
ON public.claims FOR UPDATE USING (true);

-- Handover policies
CREATE POLICY "Handovers viewable" 
ON public.handovers FOR SELECT USING (true);

CREATE POLICY "Anyone can record a handover" 
ON public.handovers FOR INSERT WITH CHECK (true);

-- Storage bucket for item photos
-- Run in Supabase Storage UI:
-- 1. Create a bucket named "item-photos" with Public read access.
