import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    priceSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    imageSnapshot: {
      type: String,
      default: "",
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
});

cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce(
    (total, item) =>
      total + item.priceSnapshot * item.quantity,
    0
  );
});

cartSchema.set("toJSON", {
  virtuals: true,
});

cartSchema.set("toObject", {
  virtuals: true,
});

export default
  mongoose.models.Cart ||
  mongoose.model("Cart", cartSchema);