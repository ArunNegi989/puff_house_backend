import { body } from "express-validator";

export const heroValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("subtitle")
    .trim()
    .notEmpty()
    .withMessage("Subtitle is required."),

  body("order")
    .optional()
    .isNumeric()
    .withMessage("Order must be numeric."),
];