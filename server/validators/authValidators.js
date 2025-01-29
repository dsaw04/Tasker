import { body } from "express-validator";

export const validateUserRegistration = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3-20 characters"),

  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%&^*]/).withMessage("Password must contain at least one special character (!@#$%&^*)"),
];
