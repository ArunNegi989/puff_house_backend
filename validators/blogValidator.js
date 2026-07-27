import { body } from "express-validator";

export const blogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({
      min: 5,
      max: 150,
    })
    .withMessage(
      "Title must be between 5 and 150 characters."
    ),

  body("excerpt")
    .trim()
    .notEmpty()
    .withMessage("Excerpt is required.")
    .isLength({
      min: 20,
      max: 300,
    })
    .withMessage(
      "Excerpt must be between 20 and 300 characters."
    ),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("author")
    .optional()
    .trim()
    .isLength({
      max: 50,
    })
    .withMessage(
      "Author name cannot exceed 50 characters."
    ),

  body("readTime")
    .optional()
    .trim()
    .isLength({
      max: 30,
    })
    .withMessage(
      "Read time cannot exceed 30 characters."
    ),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("Invalid featured value."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Invalid status value."),

  body("tags")
    .optional()
    .custom((value) => {
      if (!value) return true;

      let tags = value;

      if (typeof value === "string") {
        try {
          tags = JSON.parse(value);
        } catch {
          throw new Error(
            "Tags must be a valid array."
          );
        }
      }

      if (!Array.isArray(tags)) {
        throw new Error(
          "Tags must be an array."
        );
      }

      if (tags.length > 20) {
        throw new Error(
          "Maximum 20 tags are allowed."
        );
      }

      return true;
    }),
];