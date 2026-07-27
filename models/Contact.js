import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    orderNumber: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["Pending", "Replied"],
      default: "Pending",
    },

    replyMessage: {
      type: String,
      default: "",
    },

    repliedAt: Date,
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ email: 1 });

contactSchema.index({ status: 1 });

contactSchema.index({ createdAt: -1 });

export default mongoose.model("Contact", contactSchema);