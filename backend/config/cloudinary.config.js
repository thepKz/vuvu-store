const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Create storage engine for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dudu-store/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split('.')[0];
      return `product-${filename}-${uniqueSuffix}`;
    }
  }
});

// Create storage engine for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dudu-store/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split('.')[0];
      return `category-${filename}-${uniqueSuffix}`;
    }
  }
});

// Create storage engine for collection images
const collectionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dudu-store/collections',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split('.')[0];
      return `collection-${filename}-${uniqueSuffix}`;
    }
  }
});

// Create multer upload instances
const uploadProductImage = multer({ storage: productStorage });
const uploadCategoryImage = multer({ storage: categoryStorage });
const uploadCollectionImage = multer({ storage: collectionStorage });

// Helper function to generate a Cloudinary upload signature
const generateUploadSignature = (params = {}) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, ...params },
    process.env.CLOUDINARY_API_SECRET
  );
  
  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  };
};

module.exports = {
  cloudinary,
  uploadProductImage,
  uploadCategoryImage,
  uploadCollectionImage,
  generateUploadSignature
};