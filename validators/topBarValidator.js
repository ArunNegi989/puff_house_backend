import { body } from "express-validator";

export const createTopBarValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 120 })
    .withMessage("Message cannot exceed 120 characters"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Invalid icon"),

  body("link")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Link is too long"),
];

export const updateTopBarValidation = createTopBarValidation;