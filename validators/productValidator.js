import { body } from "express-validator";

export const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required."),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage(
      "Short description is required."
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage(
      "Description is required."
    ),

  body("price")
    .isFloat({ min: 0 })
    .withMessage(
      "Valid price is required."
    ),

  body("oldPrice")
    .optional()
    .isFloat({ min: 0 }),

  body("stock")
    .optional()
    .isInt({ min: 0 }),

  body("sku").optional(),

  body("tags").optional(),

  body("features").optional(),

  body("colors").optional(),

  body("specifications").optional(),
];