const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary environment variables!');
  console.error('Please check your .env file contains:');
  console.error('CLOUDINARY_CLOUD_NAME=dr1ounn5n');
  console.error('CLOUDINARY_API_KEY=126743626559439');
  console.error('CLOUDINARY_API_SECRET=H2zxIKQ4f4duvsebprByz2EpQOI');
  process.exit(1);
}

console.log('✅ Cloudinary configured successfully!');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'bidblaze-auctions') => {
  try {
    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Resize large images
        { quality: 'auto:good' } // Optimize quality
      ]
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Get optimized image URL with transformations
const getOptimizedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 400, height: 300, crop: 'fill' },
      { quality: 'auto:good' },
      ...transformations
    ]
  });
};

module.exports = {
  uploadImage,
  deleteImage,
  getOptimizedUrl,
  cloudinary
};
