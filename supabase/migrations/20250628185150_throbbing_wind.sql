-- Sửa lỗi quan hệ giữa product_views và products
ALTER TABLE IF EXISTS product_views 
  DROP CONSTRAINT IF EXISTS product_views_product_id_fkey;

ALTER TABLE product_views 
  ADD CONSTRAINT product_views_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES products(id) 
  ON DELETE CASCADE;

-- Tạo function để tăng view_count
CREATE OR REPLACE FUNCTION increment_product_view_count(product_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql;

-- Tạo view để phân tích dữ liệu xem sản phẩm theo thời gian
CREATE OR REPLACE VIEW product_view_trends_by_date AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as view_count,
  COUNT(DISTINCT product_id) as unique_products,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_users
FROM product_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Tạo view để phân tích dữ liệu xem sản phẩm theo danh mục
CREATE OR REPLACE VIEW product_view_by_category AS
SELECT 
  c.id as category_id,
  c.name as category_name,
  COUNT(pv.id) as view_count,
  COUNT(DISTINCT pv.product_id) as product_count,
  COUNT(DISTINCT pv.user_id) FILTER (WHERE pv.user_id IS NOT NULL) as unique_users
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN product_views pv ON p.id = pv.product_id
GROUP BY c.id, c.name
ORDER BY view_count DESC;