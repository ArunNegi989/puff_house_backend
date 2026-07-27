import { body, validationResult } from "express-validator";

export const faqValidation = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question is required"),

  body("answer")
    .trim()
    .notEmpty()
    .withMessage("Answer is required"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};