import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage engine using Cloudinary, allowing multiple formats
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async (req, file) => {
      const ext = file.mimetype.split("/")[1];
      return ["jpeg", "png", "gif"].includes(ext) ? ext : "jpg"; // Default to jpg if not matched
    },
    public_id: (req, file) => file.originalname.split(".")[0], // Optional: use original filename
  },
});
