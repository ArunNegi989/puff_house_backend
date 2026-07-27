import express from "express";

import {

    createContact,

    getContacts,

    getContactById,

    deleteContact,

    replyToContact,
} from "../controllers/contactController.js";

import { contactValidation } from "../validators/contactValidator.js";

const router = express.Router();

router.post(

    "/",

    contactValidation,

    createContact

);

router.get("/", getContacts);

router.get("/:id", getContactById);

router.delete("/:id", deleteContact);

router.post("/:id/reply", replyToContact);

export default router;