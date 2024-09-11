import mongoose from 'mongoose';

const resellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, 
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
}, { timestamps: true });



const Reseller = mongoose.model('Reseller', resellerSchema);
export default Reseller;
