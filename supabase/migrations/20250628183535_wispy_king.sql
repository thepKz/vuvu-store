-- Fix product_views table relationships
ALTER TABLE IF EXISTS product_views 
  DROP CONSTRAINT IF EXISTS fk_product_views_product;

ALTER TABLE product_views 
  ADD CONSTRAINT fk_product_views_product 
  FOREIGN KEY (product_id) 
  REFERENCES products(id) 
  ON DELETE CASCADE;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;