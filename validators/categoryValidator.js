import { body } from "express-validator";

export const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required."),

  body("description")
    .optional()
    .trim(),

  body("order")
    .notEmpty()
    .withMessage("Order is required.")
    .isNumeric()
    .withMessage("Order must be a number."),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false."),
];