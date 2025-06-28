# Dudu Store Backend API

This is the backend API for Dudu Store, a premium squishy e-commerce platform.

## Features

- RESTful API with Express.js
- PostgreSQL database
- JWT authentication
- Cloudinary integration for image uploads
- Swagger API documentation
- View tracking and analytics
- Admin dashboard API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Cloudinary account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your configuration
4. Run database migrations:
   ```
   npm run migrate
   ```
5. Start the server:
   ```
   npm start
   ```

For development:
```
npm run dev
```

### API Documentation

API documentation is available at `/api-docs` when the server is running.

## Project Structure

```
backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── docs/               # API documentation
├── middleware/         # Express middleware
├── migrations/         # Database migrations
├── models/             # Data models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── .env.example        # Environment variables example
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── server.js           # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/update-password` - Update password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin)
- `PATCH /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/sale` - Get sale products
- `GET /api/products/:id/related` - Get related products
- `POST /api/products/search` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/products` - Get products by category
- `POST /api/categories` - Create a new category (admin)
- `PATCH /api/categories/:id` - Update a category (admin)
- `DELETE /api/categories/:id` - Delete a category (admin)

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get collection by ID
- `GET /api/collections/:id/products` - Get products by collection
- `POST /api/collections` - Create a new collection (admin)
- `PATCH /api/collections/:id` - Update a collection (admin)
- `DELETE /api/collections/:id` - Delete a collection (admin)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/my-orders/:id` - Get user's order by ID
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID (admin)
- `PATCH /api/orders/:id` - Update an order (admin)
- `DELETE /api/orders/:id` - Delete an order (admin)

### Media
- `POST /api/media/upload/product` - Upload product image
- `POST /api/media/upload/category` - Upload category image
- `POST /api/media/upload/collection` - Upload collection image
- `GET /api/media/library` - Get media library (admin)
- `POST /api/media/folder` - Create media folder (admin)
- `DELETE /api/media/:publicId` - Delete image (admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics (admin)
- `GET /api/analytics/products/views` - Get product view statistics (admin)
- `GET /api/analytics/users/activity` - Get user activity statistics (admin)
- `GET /api/analytics/sales` - Get sales statistics (admin)

## License

This project is licensed under the MIT License.