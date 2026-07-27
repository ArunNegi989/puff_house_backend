import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ==========================================
   GET ALL
========================================== */

export const getAddresses = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id).select(
      "addresses"
    );

    res.json({
      success: true,
      data: user.addresses,
    });
  }
);

/* ==========================================
   ADD
========================================== */

export const addAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);

    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: user.addresses,
    });
  }
);

/* ==========================================
   UPDATE
========================================== */

export const updateAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);

    const address =
      user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    Object.assign(address, req.body);

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully.",
      data: address,
    });
  }
);

/* ==========================================
   DELETE
========================================== */

export const deleteAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);

    const address =
      user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault = address.isDefault;

    address.deleteOne();

    if (
      wasDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully.",
    });
  }
);

/* ==========================================
   SET DEFAULT
========================================== */

export const setDefaultAddress =
  asyncHandler(async (req, res) => {
    const user = await User.findById(
      req.user._id
    );

    user.addresses.forEach((a) => {
      a.isDefault = false;
    });

    const address =
      user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    address.isDefault = true;

    await user.save();

    res.json({
      success: true,
      message:
        "Default address updated.",
    });
  });