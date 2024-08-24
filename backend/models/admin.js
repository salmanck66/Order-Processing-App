import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  refreshTokens: {
    type: [String], // Store multiple refresh tokens
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
