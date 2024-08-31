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
  customers: [
    {
      name: {
        type: String,
        required: true,
      },
      products: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          sizes: [
            {
              size: {
                type: String,
                enum: ['S', 'M', 'L', 'XL', 'XXL'],
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                min: 1,
              },
            },
          ],
        },
      ],
      label: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
