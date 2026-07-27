import express from "express";

import {
  createTopBar,
  updateTopBar,
  deleteTopBar,
  getTopBars,
  getAdminTopBars,
  toggleTopBarStatus,
  moveTopBarUp,
  moveTopBarDown,
} from "../controllers/topBarController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  createTopBarValidation,
  updateTopBarValidation,
} from "../validators/topBarValidator.js";

const router = express.Router();

/* ==========================================================
   PUBLIC
========================================================== */

router.get("/", getTopBars);

/* ==========================================================
   ADMIN
========================================================== */

router.get( "/admin",  authenticate,  authorize("admin"),  getAdminTopBars);

router.post(  "/",  authenticate,  authorize("admin"),  createTopBarValidation,  createTopBar);

router.put(  "/:id",  authenticate,  authorize("admin"),  updateTopBarValidation,  updateTopBar);

router.delete(  "/:id",  authenticate,  authorize("admin"),  deleteTopBar);

router.patch(  "/:id/toggle",  authenticate,  authorize("admin"),  toggleTopBarStatus);

router.patch(  "/:id/up",  authenticate,  authorize("admin"),  moveTopBarUp);

router.patch(  "/:id/down",  authenticate,  authorize("admin"),  moveTopBarDown);



export default router;