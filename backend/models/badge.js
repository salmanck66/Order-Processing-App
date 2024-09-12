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
  image: {  // Renamed to `image` for a single image
    url: { type: String, required: true },
  },
});

const Badge = mongoose.model("Badge", badgeSizeSchema);
export default Badge;
