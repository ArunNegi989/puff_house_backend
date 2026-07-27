import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAddresses);

router.post("/", addAddress);

router.put("/:id", updateAddress);

router.delete("/:id", deleteAddress);

router.patch(
  "/default/:id",
  setDefaultAddress
);

export default router;