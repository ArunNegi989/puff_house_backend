import TopBar from "../models/TopBar.js";

import asyncHandler from "../utils/asyncHandler.js";

export const createTopBar = asyncHandler(async (req, res) => {
  const { message, icon, link } = req.body;

  const lastTopBar = await TopBar.findOne().sort("-order");

  const nextOrder = lastTopBar ? lastTopBar.order + 1 : 1;

  const topBar = await TopBar.create({
    message,
    icon,
    link,
    order: nextOrder,
  });

  return res.status(201).json({
    success: true,
    message: "Top bar created successfully.",
    data: topBar,
  });
});

export const getTopBars = asyncHandler(async (req, res) => {
  const topBars = await TopBar.find({
    isActive: true,
  }).sort({
    order: 1,
  });

  return res.status(200).json({
    success: true,
    data: topBars,
  });
});

export const getAdminTopBars = asyncHandler(async (req, res) => {
  const topBars = await TopBar.find().sort({
    order: 1,
  });

  return res.status(200).json({
    success: true,
    data: topBars,
  });
});

export const updateTopBar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, icon, link, isActive } = req.body;

  const topBar = await TopBar.findById(id);

  if (!topBar) {
    return res.status(404).json({
      success: false,
      message: "Top bar not found.",
    });
  }

  topBar.message = message;
  topBar.icon = icon;
  topBar.link = link;

  if (typeof isActive === "boolean") {
    topBar.isActive = isActive;
  }

  await topBar.save();

  return res.status(200).json({
    success: true,
    message: "Top bar updated successfully.",
    data: topBar,
  });
});

export const deleteTopBar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topBar = await TopBar.findById(id);

  if (!topBar) {
    return res.status(404).json({
      success: false,
      message: "Top bar not found.",
    });
  }

  const deletedOrder = topBar.order;

  await topBar.deleteOne();

  await TopBar.updateMany(
    {
      order: { $gt: deletedOrder },
    },
    {
      $inc: {
        order: -1,
      },
    }
  );

  return res.status(200).json({
    success: true,
    message: "Top bar deleted successfully.",
  });
});

export const toggleTopBarStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topBar = await TopBar.findById(id);

  if (!topBar) {
    return res.status(404).json({
      success: false,
      message: "Top bar not found.",
    });
  }

  topBar.isActive = !topBar.isActive;

  await topBar.save();

  return res.status(200).json({
    success: true,
    message: `Top bar ${
      topBar.isActive ? "enabled" : "disabled"
    } successfully.`,
    data: topBar,
  });
});

export const moveTopBarUp = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const current = await TopBar.findById(id);

  if (!current) {
    return res.status(404).json({
      success: false,
      message: "Top bar not found.",
    });
  }

  const previous = await TopBar.findOne({
    order: current.order - 1,
  });

  if (!previous) {
    return res.status(400).json({
      success: false,
      message: "Already at the top.",
    });
  }

  const currentOrder = current.order;

  current.order = previous.order;
  previous.order = currentOrder;

  await current.save();
  await previous.save();

  return res.status(200).json({
    success: true,
    message: "Top bar moved up successfully.",
  });
});

export const moveTopBarDown = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const current = await TopBar.findById(id);

  if (!current) {
    return res.status(404).json({
      success: false,
      message: "Top bar not found.",
    });
  }

  const next = await TopBar.findOne({
    order: current.order + 1,
  });

  if (!next) {
    return res.status(400).json({
      success: false,
      message: "Already at the bottom.",
    });
  }

  const currentOrder = current.order;

  current.order = next.order;
  next.order = currentOrder;

  await current.save();
  await next.save();

  return res.status(200).json({
    success: true,
    message: "Top bar moved down successfully.",
  });
});