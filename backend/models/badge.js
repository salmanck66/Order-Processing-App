import mongoose from "mongoose";

const badgeSizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [  // Renamed from `image` to `images`
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
});

const Badge = mongoose.model("Badge", badgeSizeSchema);
export default Badge;
