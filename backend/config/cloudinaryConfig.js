import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage engine using Cloudinary
const storage = new CloudinaryStorage({
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

// Create the upload middleware
const upload = multer({ storage: storage });

// Export both storage and upload
export { storage, upload };
