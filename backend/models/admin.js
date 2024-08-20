import mongoose from 'mongoose';

// Define the Admin Schema
const adminSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true, // Store the refresh token
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Boolean,
    default: false,
  },
});

// Export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
