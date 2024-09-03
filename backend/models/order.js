import mongoose from 'mongoose';
import { type } from 'os';
import { boolean } from 'yargs';

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
      customerName:{
        type: String,
        required: true,
      },
      orders: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          orderSizes: {
            type: Map,
            of: Number,
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
  status:{
    type:Boolean,
    default:flase
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Order = mongoose.model('Order', orderSchema);
export default Order;
