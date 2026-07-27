import { body } from "express-validator";

export const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number."),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required."),

  body("orderNumber")
    .trim()
    .notEmpty()
    .withMessage("Order number is required.")
    .isLength({ max: 50 })
    .withMessage("Order number cannot exceed 50 characters."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters."),
];