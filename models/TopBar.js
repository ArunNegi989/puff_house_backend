import mongoose from "mongoose";

const topBarSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [120, "Message cannot exceed 120 characters"],
    },

    icon: {
      type: String,
      trim: true,
      default: "🚚",
    },

    link: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TopBar ||
  mongoose.model("TopBar", topBarSchema);