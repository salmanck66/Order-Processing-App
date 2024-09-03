import mongoose from "mongoose";
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
      customerName: {
        type: String,
        required: true,
      },
      orders: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true,
          },
          orderSizes: {
            type: Map,
            of: Number,
            sizestock: { type: Boolean, default: true },
            required: true,
          },
        },
      ],
      label: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
