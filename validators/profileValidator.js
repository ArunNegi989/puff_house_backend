import { body } from "express-validator";

export const profileValidation = [

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .matches(/^[0-9]{10,15}$/)
        .withMessage("Invalid phone number."),

];