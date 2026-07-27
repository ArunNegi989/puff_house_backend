import express from "express";

import {

    authenticate,

} from "../middleware/authMiddleware.js";

import {

    getProfile,

    updateProfile,

} from "../controllers/profileController.js";

import {

    profileValidation,

} from "../validators/profileValidator.js";

const router = express.Router();

router.get(

    "/",

    authenticate,

    getProfile

);

router.patch(

    "/",

    authenticate,

    profileValidation,

    updateProfile

);

export default router;