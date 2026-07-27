import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import {
  authenticate,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
GET
/api/notifications
*/

router.get(
  "/",
  authenticate,
  getNotifications
);

/*
GET
/api/notifications/count
*/

router.get(
  "/count",
  authenticate,
  getUnreadCount
);

/*
PATCH
/api/notifications/:id/read
*/

router.patch(
  "/:id/read",
  authenticate,
  markAsRead
);

/*
PATCH
/api/notifications/read-all
*/

router.patch(
  "/read-all",
  authenticate,
  markAllAsRead
);

/*
DELETE
/api/notifications/:id
*/

router.delete(
  "/:id",
  authenticate,
  deleteNotification
);

export default router;