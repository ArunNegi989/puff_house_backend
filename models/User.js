import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },

    fullName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    addressLine1: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    countryCode: {
      type: String,
      default: "+1",
    },

    deliveryInstructions: {
      type: String,
      default: "",
    },

    landmark: {
      type: String,
      default: "",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOTP: String,

    emailVerificationOTPExpires: Date,

    passwordResetOTP: String,

    passwordResetOTPExpires: Date,

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);