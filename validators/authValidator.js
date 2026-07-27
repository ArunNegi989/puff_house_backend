import { body } from "express-validator";

export const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 50 }),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain one number.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain one special character."),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Zipcode is required."),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match.");

      return true;
    }),
];

export const loginValidation = [
  body("email").isEmail(),

  body("password").notEmpty(),
];