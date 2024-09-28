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
const badgeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',  // Reference to Badge schema
      required: true,
    }
  ]
});

const customizationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  size: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Vinyl", "DTF","ORIGINAL(RETROS)"],  // Customization type, e.g., size or color
  },
  productType: {
    type: String,
    enum: ["Vinyl", "DTF", "ORIGINAL(RETROS)"],  // Customization type
  }
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
          customizations: {
            type: [customizationSchema],  // Including the customization schema here
            required: false,  // Customization can be optional based on product type
          },
          badges: {
            type: [badgeSchema], 
            required: false, 
          },
          status: {
            type: Boolean,
            default: false,
          }
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
export default Order