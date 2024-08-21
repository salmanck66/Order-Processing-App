import mongoose from 'mongoose';

const resellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespace
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensures each number is unique
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'], // Validates phone number format
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures each email is unique
    match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Validates email format
  },
  password: {
    type: String,
    required: true, // Ensure that the password is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date when a new reseller is created
  },
});

const Reseller = mongoose.model('Reseller', resellerSchema);
export default Reseller;
