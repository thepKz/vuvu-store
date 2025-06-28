/*
  # Fix Analytics Relationships

  1. Changes
     - Add foreign key constraints to product_views table
     - Add missing indexes for analytics tables
     - Update user_activity table structure
     - Add settings for analytics configuration

  2. Security
     - Enable RLS on analytics tables
     - Add policies for admin access
*/

-- Fix product_views table relationships
ALTER TABLE product_views 
  ADD CONSTRAINT fk_product_views_product 
  FOREIGN KEY (product_id) 
  REFERENCES products(id) 
  ON DELETE CASCADE;

-- Add missing indexes for analytics
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);

-- Add analytics settings
INSERT INTO settings (key, value, created_at, updated_at)
VALUES 
  ('analytics_retention_days', '90', NOW(), NOW()),
  ('analytics_enabled', 'true', NOW(), NOW()),
  ('popular_products_count', '10', NOW(), NOW()),
  ('trending_products_count', '8', NOW(), NOW());

-- Enable RLS on analytics tables
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for admin access
CREATE POLICY "Admins can view all product views" 
  ON product_views 
  FOR SELECT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all user activity" 
  ON user_activity 
  FOR SELECT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all search queries" 
  ON search_queries 
  FOR SELECT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');