import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the Admin Schema
const adminSchema = new mongoose.Schema({
    
    phoneno: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
