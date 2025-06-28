const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const collectionRoutes = require('./routes/collection.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const mediaRoutes = require('./routes/media.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/authMiddleware');

// Initialize express app
const app = express();

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;