import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' }, // 'auto' will handle various types (image, video, etc.)
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          return reject(error);
        }
        return resolve(result.secure_url);
      }
    );

    // Create a readable stream from the buffer and pipe it to the upload stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
