import mongoose from "mongoose";
const orderSizeSchema = new mongoose.Schema({
  size: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  sizestock: {
    type: Boolean,
    default: true,
  },
});

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
            ref: 'Product',
            required: true,
          },
          orderSizes: {
            type: [orderSizeSchema],
            required: true,
          },
        },
      ],
      label: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: false,
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
