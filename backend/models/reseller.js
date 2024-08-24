import mongoose from 'mongoose';

const resellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] }, // Array to store multiple refresh tokens
});

const Reseller = mongoose.model('resellers', resellerSchema);
export default Reseller;
