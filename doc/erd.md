# DUDU STORE - DATABASE SCHEMA (ERD)

## 📊 **ENTITY RELATIONSHIP DIAGRAM**

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Users       │       │    Products     │       │   Categories    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ email           │       │ name            │       │ name            │
│ password_hash   │       │ description     │       │ description     │
│ first_name      │       │ price           │       │ slug            │
│ last_name       │       │ original_price  │       │ image           │
│ phone           │       │ stock           │       │ parent_id       │
│ address         │       │ image           │       │ created_at      │
│ role            │       │ category_id     │       │ updated_at      │
│ created_at      │       │ collection_id   │       └─────────────────┘
│ updated_at      │       │ is_featured     │               ▲
└─────────────────┘       │ is_new          │               │
        │                 │ is_sale         │               │
        │                 │ badge           │               │
        │                 │ rating          │               │
        │                 │ created_at      │               │
        │                 │ updated_at      │               │
        │                 └─────────────────┘               │
        │                         ▲                         │
        │                         │                         │
        │                         │                         │
┌─────────────────┐       ┌─────────────────┐               │
│     Orders      │       │ Product_Variants│               │
├─────────────────┤       ├─────────────────┤               │
│ id              │       │ id              │               │
│ user_id         │──────>│ product_id      │───────────────┘
│ status          │       │ name            │
│ total_amount    │       │ price           │
│ shipping_address│       │ stock           │
│ payment_method  │       │ image           │
│ payment_status  │       │ created_at      │
│ created_at      │       │ updated_at      │
│ updated_at      │       └─────────────────┘
└─────────────────┘               ▲
        │                         │
        │                         │
        ▼                         │
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Order_Items   │       │   Collections   │       │     Reviews     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ order_id        │       │ name            │       │ product_id      │
│ product_id      │       │ description     │       │ user_id         │
│ variant_id      │       │ image           │       │ rating          │
│ quantity        │       │ badge           │       │ comment         │
│ price           │       │ color           │       │ is_verified     │
│ created_at      │       │ created_at      │       │ created_at      │
│ updated_at      │       │ updated_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                  │
                                  │
                                  ▼
                          ┌─────────────────┐
                          │Product_Collection│
                          ├─────────────────┤
                          │ id              │
                          │ product_id      │
                          │ collection_id   │
                          │ created_at      │
                          │ updated_at      │
                          └─────────────────┘
```

## 🔑 **PRIMARY ENTITIES & RELATIONSHIPS**

### **1. Users**
- **Description**: Stores user account information
- **Relationships**:
  - One-to-Many with Orders (1 user can have many orders)
  - One-to-Many with Reviews (1 user can write many reviews)

### **2. Products**
- **Description**: Main product catalog
- **Relationships**:
  - Many-to-One with Categories (Many products can belong to 1 category)
  - One-to-Many with Product_Variants (1 product can have many variants)
  - Many-to-Many with Collections (through Product_Collection)
  - One-to-Many with Reviews (1 product can have many reviews)
  - One-to-Many with Order_Items (1 product can be in many order items)

### **3. Categories**
- **Description**: Product categories with hierarchical structure
- **Relationships**:
  - One-to-Many with Products (1 category can have many products)
  - Self-referential for parent-child relationships

### **4. Collections**
- **Description**: Special product groupings (e.g., "Limited Edition", "Premium")
- **Relationships**:
  - Many-to-Many with Products (through Product_Collection)

### **5. Orders**
- **Description**: Customer orders
- **Relationships**:
  - Many-to-One with Users (Many orders can belong to 1 user)
  - One-to-Many with Order_Items (1 order can have many items)

### **6. Order_Items**
- **Description**: Individual items within an order
- **Relationships**:
  - Many-to-One with Orders (Many items can belong to 1 order)
  - Many-to-One with Products (Many items can reference 1 product)
  - Many-to-One with Product_Variants (Many items can reference 1 variant)

### **7. Product_Variants**
- **Description**: Variations of products (e.g., size, color)
- **Relationships**:
  - Many-to-One with Products (Many variants can belong to 1 product)

### **8. Reviews**
- **Description**: Product reviews and ratings
- **Relationships**:
  - Many-to-One with Products (Many reviews can belong to 1 product)
  - Many-to-One with Users (Many reviews can be written by 1 user)

### **9. Product_Collection**
- **Description**: Junction table for many-to-many relationship
- **Relationships**:
  - Many-to-One with Products
  - Many-to-One with Collections

## 📝 **DETAILED TABLE SCHEMAS**

### **Users Table**
| Column        | Type         | Constraints                |
|---------------|--------------|----------------------------|
| id            | UUID         | PRIMARY KEY                |
| email         | VARCHAR(255) | UNIQUE, NOT NULL          |
| password_hash | VARCHAR(255) | NOT NULL                  |
| first_name    | VARCHAR(100) | NOT NULL                  |
| last_name     | VARCHAR(100) | NOT NULL                  |
| phone         | VARCHAR(20)  |                           |
| address       | TEXT         |                           |
| role          | VARCHAR(20)  | DEFAULT 'customer'        |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Products Table**
| Column         | Type         | Constraints                |
|----------------|--------------|----------------------------|
| id             | UUID         | PRIMARY KEY                |
| name           | VARCHAR(255) | NOT NULL                  |
| description    | TEXT         |                           |
| price          | DECIMAL(10,2)| NOT NULL                  |
| original_price | DECIMAL(10,2)|                           |
| stock          | INTEGER      | DEFAULT 0                 |
| image          | VARCHAR(255) |                           |
| category_id    | UUID         | FOREIGN KEY               |
| collection_id  | UUID         | FOREIGN KEY               |
| is_featured    | BOOLEAN      | DEFAULT false             |
| is_new         | BOOLEAN      | DEFAULT false             |
| is_sale        | BOOLEAN      | DEFAULT false             |
| badge          | VARCHAR(50)  |                           |
| rating         | DECIMAL(3,1) | DEFAULT 0                 |
| created_at     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Categories Table**
| Column     | Type         | Constraints                |
|------------|--------------|----------------------------|
| id         | UUID         | PRIMARY KEY                |
| name       | VARCHAR(100) | NOT NULL                  |
| description| TEXT         |                           |
| slug       | VARCHAR(100) | UNIQUE, NOT NULL          |
| image      | VARCHAR(255) |                           |
| parent_id  | UUID         | FOREIGN KEY (self)        |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Collections Table**
| Column     | Type         | Constraints                |
|------------|--------------|----------------------------|
| id         | UUID         | PRIMARY KEY                |
| name       | VARCHAR(100) | NOT NULL                  |
| description| TEXT         |                           |
| image      | VARCHAR(255) |                           |
| badge      | VARCHAR(50)  |                           |
| color      | VARCHAR(20)  |                           |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Product_Collection Table**
| Column        | Type      | Constraints                |
|---------------|-----------|----------------------------|
| id            | UUID      | PRIMARY KEY                |
| product_id    | UUID      | FOREIGN KEY                |
| collection_id | UUID      | FOREIGN KEY                |
| created_at    | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at    | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### **Product_Variants Table**
| Column     | Type         | Constraints                |
|------------|--------------|----------------------------|
| id         | UUID         | PRIMARY KEY                |
| product_id | UUID         | FOREIGN KEY                |
| name       | VARCHAR(100) | NOT NULL                  |
| price      | DECIMAL(10,2)| NOT NULL                  |
| stock      | INTEGER      | DEFAULT 0                 |
| image      | VARCHAR(255) |                           |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Orders Table**
| Column           | Type         | Constraints                |
|------------------|--------------|----------------------------|
| id               | UUID         | PRIMARY KEY                |
| user_id          | UUID         | FOREIGN KEY                |
| status           | VARCHAR(50)  | DEFAULT 'pending'          |
| total_amount     | DECIMAL(10,2)| NOT NULL                  |
| shipping_address | TEXT         | NOT NULL                  |
| payment_method   | VARCHAR(50)  | NOT NULL                  |
| payment_status   | VARCHAR(50)  | DEFAULT 'pending'          |
| created_at       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Order_Items Table**
| Column     | Type         | Constraints                |
|------------|--------------|----------------------------|
| id         | UUID         | PRIMARY KEY                |
| order_id   | UUID         | FOREIGN KEY                |
| product_id | UUID         | FOREIGN KEY                |
| variant_id | UUID         | FOREIGN KEY                |
| quantity   | INTEGER      | NOT NULL                  |
| price      | DECIMAL(10,2)| NOT NULL                  |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### **Reviews Table**
| Column      | Type         | Constraints                |
|-------------|--------------|----------------------------|
| id          | UUID         | PRIMARY KEY                |
| product_id  | UUID         | FOREIGN KEY                |
| user_id     | UUID         | FOREIGN KEY                |
| rating      | INTEGER      | NOT NULL                  |
| comment     | TEXT         |                           |
| is_verified | BOOLEAN      | DEFAULT false             |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

## 🔄 **BUSINESS RULES & CONSTRAINTS**

### **1. User Management**
- Email addresses must be unique
- Passwords must be stored as secure hashes
- User roles include: 'customer', 'admin', 'staff'

### **2. Product Management**
- Products can belong to only one category
- Products can be part of multiple collections
- Product stock must be non-negative
- Price must be greater than zero
- Rating is calculated as average of review ratings

### **3. Order Processing**
- Orders have statuses: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
- Payment statuses: 'pending', 'paid', 'failed', 'refunded'
- Order total must match sum of order items
- Stock is reduced when order is placed

### **4. Reviews**
- Users can only review products they've purchased (verified reviews)
- Rating must be between 1-5
- Users can only leave one review per product

### **5. Collections**
- Collections are curated groups of products
- Products can belong to multiple collections
- Collections have visual attributes (badge, color)

## 🔐 **SECURITY CONSIDERATIONS**

### **1. Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt

### **2. Data Protection**
- Personal data encryption
- HTTPS for all API endpoints
- Input validation and sanitization

### **3. Row-Level Security**
- Users can only access their own orders and reviews
- Admin users have full access
- Staff users have limited access based on role

## 📈 **INDEXING STRATEGY**

### **1. Primary Indexes**
- All primary keys (id columns)

### **2. Foreign Key Indexes**
- All foreign key columns for faster joins

### **3. Performance Indexes**
- Products: category_id, collection_id, is_featured, is_new, is_sale
- Orders: user_id, status, payment_status
- Reviews: product_id, user_id
- Categories: parent_id, slug

## 🔍 **QUERY PATTERNS**

### **1. Common Queries**
- Get featured products
- Get products by category
- Get products by collection
- Get user orders
- Get product reviews
- Get product variants

### **2. Complex Queries**
- Get related products
- Get popular products based on orders
- Get recommended products based on user history
- Get product availability across variants

## 🚀 **IMPLEMENTATION NOTES**

### **1. Database Technology**
- PostgreSQL for relational data
- Redis for caching and session management

### **2. Migration Strategy**
- Incremental migrations with version control
- Seed data for development and testing

### **3. Performance Considerations**
- Connection pooling
- Query optimization
- Proper indexing
- Pagination for large result sets

### **4. Backup Strategy**
- Daily full backups
- Point-in-time recovery
- Geo-redundant storage

## 📊 **DATA FLOW DIAGRAM**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User       │     │  Product    │     │  Admin      │
│  Interface  │     │  Catalog    │     │  Dashboard  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│                   API LAYER                         │
│                                                     │
└─────────────────────────────────────────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User &     │     │  Product &  │     │  Order &    │
│  Auth       │     │  Catalog    │     │  Payment    │
│  Services   │     │  Services   │     │  Services   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│                 DATABASE LAYER                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🔄 **FUTURE EXPANSION**

### **1. Additional Entities**
- Wishlists
- Coupons and Discounts
- Product Tags
- User Activity Logs
- Shipping Methods

### **2. Feature Enhancements**
- Product recommendation engine
- Advanced search functionality
- Loyalty program
- Subscription services
- Multi-vendor support

### **3. Performance Scaling**
- Read replicas for high-traffic queries
- Sharding for large datasets
- Materialized views for complex reports
- Caching layer for frequent queries