import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  edition: {
    type: String,
    enum: ['Fan Version', 'Player Version', 'First Copy Set','Retro', 'Default'],
    required: true,
  },
  sizes: {
    S: { type: Boolean, default: true },
    M: { type: Boolean, default: true },
    L: { type: Boolean, default: true },
    XL: { type: Boolean, default: true },
    XXL: { type: Boolean, default: true },
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  stock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
