import { body } from "express-validator";

export const checkEmailValidation = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email."),
];