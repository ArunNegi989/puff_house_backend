import Notification from "../models/Notification.js";

/**
 * GET
 * /api/notifications
 */

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * GET
 * /api/notifications/count
 */

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch unread count.",
    });
  }
};

/**
 * PATCH
 * /api/notifications/:id/read
 */

export const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

/**
 * PATCH
 * /api/notifications/read-all
 */

export const markAllAsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message:
        "All notifications marked as read.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * DELETE
 * /api/notifications/:id
 */

export const deleteNotification = async (
  req,
  res
) => {
  try {
    const deleted =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Notification deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * Utility Function
 * Internal Use
 */

export const createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  icon = "bell",
  priority = "medium",
  redirectUrl = "/",
  expiresAt = null,
}) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    icon,
    priority,
    redirectUrl,
    expiresAt,
  });
};