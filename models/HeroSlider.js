import mongoose from "mongoose";

const heroSliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    primaryButton: {
      text: {
        type: String,
        default: "Shop Now",
      },
      link: {
        type: String,
        default: "/categories",
      },
    },

    secondaryButton: {
      text: {
        type: String,
        default: "Explore More",
      },
      link: {
        type: String,
        default: "/shop",
      },
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HeroSlider", heroSliderSchema);