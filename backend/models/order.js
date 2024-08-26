import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  reseller: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reseller',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Assuming you're storing the image URL as a string
        required: true,
      },
      size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true,
      },
      sizeQuantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Orders', orderSchema);
export default Order;
