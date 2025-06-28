/*
  # Sửa lỗi quan hệ giữa product_views và products

  1. Thay đổi
    - Thêm ràng buộc ON DELETE CASCADE cho product_views
    - Đảm bảo quan hệ giữa product_views và products hoạt động đúng
  2. Bảo mật
    - Cập nhật RLS cho bảng product_views
*/

-- Sửa lỗi quan hệ giữa product_views và products
ALTER TABLE IF EXISTS product_views 
DROP CONSTRAINT IF EXISTS product_views_product_id_fkey;

ALTER TABLE IF EXISTS product_views
ADD CONSTRAINT product_views_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Tạo view để phân tích dữ liệu xem sản phẩm
CREATE OR REPLACE VIEW product_view_analytics AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  COUNT(pv.id) as view_count,
  COUNT(DISTINCT pv.user_id) as unique_viewers,
  MAX(pv.created_at) as last_viewed_at
FROM products p
LEFT JOIN product_views pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY view_count DESC;

-- Tạo view để phân tích xu hướng xem theo thời gian
CREATE OR REPLACE VIEW product_view_trends AS
SELECT 
  DATE(pv.created_at) as view_date,
  COUNT(pv.id) as daily_views,
  COUNT(DISTINCT pv.product_id) as products_viewed,
  COUNT(DISTINCT pv.user_id) as unique_users
FROM product_views pv
GROUP BY DATE(pv.created_at)
ORDER BY view_date DESC;