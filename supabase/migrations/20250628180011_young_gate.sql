-- Seed Categories
INSERT INTO categories (id, name, description, slug, image)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'DIMOO', 'DIMOO Collection', 'dimoo', 'https://res.cloudinary.com/demo/image/upload/dudu-store/categories/dimoo'),
  ('22222222-2222-2222-2222-222222222222', 'MOLLY', 'MOLLY Collection', 'molly', 'https://res.cloudinary.com/demo/image/upload/dudu-store/categories/molly'),
  ('33333333-3333-3333-3333-333333333333', 'LABUBU', 'LABUBU Collection', 'labubu', 'https://res.cloudinary.com/demo/image/upload/dudu-store/categories/labubu');

-- Seed Collections
INSERT INTO collections (id, name, description, image, badge, color)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'Premium Collection', 'Bộ sưu tập cao cấp với chất liệu và thiết kế đặc biệt', 'https://res.cloudinary.com/demo/image/upload/dudu-store/collections/premium', 'Premium', '#ec4899'),
  ('55555555-5555-5555-5555-555555555555', 'Limited Edition', 'Phiên bản giới hạn chỉ có tại Dudu Store', 'https://res.cloudinary.com/demo/image/upload/dudu-store/collections/limited', 'Limited', '#f59e0b'),
  ('66666666-6666-6666-6666-666666666666', 'Seasonal Collection', 'Bộ sưu tập theo mùa với thiết kế thời thượng', 'https://res.cloudinary.com/demo/image/upload/dudu-store/collections/seasonal', 'Seasonal', '#10b981');

-- Seed Products
INSERT INTO products (id, name, description, price, original_price, stock, image, category_id, is_featured, is_new, is_sale, badge, rating)
VALUES 
  ('77777777-7777-7777-7777-777777777777', 'DIMOO Premium Collection', 'Bộ sưu tập cao cấp với thiết kế độc đáo', 230000, NULL, 10, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/dimoo-premium', '11111111-1111-1111-1111-111111111111', true, true, false, 'Mới', 4.9),
  ('88888888-8888-8888-8888-888888888888', 'DIMOO Limited Edition', 'Phiên bản giới hạn chỉ có tại Dudu Store', 253000, NULL, 5, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/dimoo-limited', '11111111-1111-1111-1111-111111111111', true, false, false, 'Hot', 4.8),
  ('99999999-9999-9999-9999-999999999999', 'MOLLY Exclusive Series', 'Series độc quyền với chất liệu cao cấp', 805000, 1150000, 8, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/molly-exclusive', '22222222-2222-2222-2222-222222222222', true, false, true, 'Sale', 4.7),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MOLLY Deluxe Collection', 'Bộ sưu tập deluxe với packaging đặc biệt', 805000, 1150000, 3, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/molly-deluxe', '22222222-2222-2222-2222-222222222222', false, false, true, 'Sale', 4.9),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'LABUBU Special Edition', 'Phiên bản đặc biệt với màu sắc độc đáo', 805000, 1150000, 6, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/labubu-special', '33333333-3333-3333-3333-333333333333', false, true, true, 'Sale', 4.8),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'LABUBU Collector Series', 'Series sưu tập dành cho collector', 805000, 1150000, 4, 'https://res.cloudinary.com/demo/image/upload/dudu-store/products/labubu-collector', '33333333-3333-3333-3333-333333333333', true, false, true, 'Sale', 4.6);

-- Seed Product Variants
INSERT INTO product_variants (id, product_id, name, price, stock, image)
VALUES 
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', 'Kích thước S', 230000, 5, NULL),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', 'Kích thước M', 280000, 3, NULL),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '88888888-8888-8888-8888-888888888888', 'Kích thước S', 253000, 2, NULL),
  ('11111111-2222-3333-4444-555555555555', '88888888-8888-8888-8888-888888888888', 'Kích thước M', 300000, 3, NULL),
  ('22222222-3333-4444-5555-666666666666', '99999999-9999-9999-9999-999999999999', 'Kích thước S', 805000, 4, NULL),
  ('33333333-4444-5555-6666-777777777777', '99999999-9999-9999-9999-999999999999', 'Kích thước M', 950000, 2, NULL),
  ('44444444-5555-6666-7777-888888888888', '99999999-9999-9999-9999-999999999999', 'Kích thước L', 1050000, 2, NULL);

-- Seed Product-Collection Relationships
INSERT INTO product_collection (product_id, collection_id)
VALUES 
  ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444'),
  ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555'),
  ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444');

-- Seed Admin User
INSERT INTO users (id, email, password_hash, first_name, last_name, role)
VALUES 
  ('admin-user-id', 'admin@dudustore.com', '$2a$12$QOpS/9/WR1INB8GsT8zKEOuo7EGHnVQtPYOKXJiRaUKwQ9sOHkB.e', 'Admin', 'User', 'admin');
-- Password is 'password123'

-- Seed Settings
INSERT INTO settings (key, value)
VALUES 
  ('site_name', 'Dudu Store'),
  ('site_description', 'Premium Squishy Collection'),
  ('currency', 'VND'),
  ('tax_rate', '10'),
  ('shipping_fee', '30000'),
  ('free_shipping_threshold', '500000'),
  ('contact_email', 'contact@dudustore.com'),
  ('contact_phone', '0123456789'),
  ('contact_address', '123 Đường ABC, Quận XYZ, TP.HCM');