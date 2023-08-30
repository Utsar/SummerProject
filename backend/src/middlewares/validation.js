// backend>src>middlewares>validation.js

import Joi from "@hapi/joi";
import { rateLimiter } from "./rateLimiter";
import { customErrorHandler } from "./customErrorHandler";

// Complex password validation rule
const passwordComplexity = Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .min(8)
  .required()
  .label("Password");

// User Registration Validation
export const validateUserRegistration = [
  rateLimiter,
  (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(2).required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      password: passwordComplexity,
    });

    const { error } = schema.validate(req.body);
    customErrorHandler(error, req, res, next);
  },
];

// User Login Validation
export const validateUserLogin = [
  rateLimiter,
  (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    const { error } = schema.validate(req.body);
    customErrorHandler(error, req, res, next);
  },
];

// Password Reset Request Validation
export const validatePasswordResetRequest = [
  rateLimiter,
  (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });

    const { error } = schema.validate(req.body);
    customErrorHandler(error, req, res, next);
  },
];

// Reset Password Validation
export const validateResetPassword = [
  rateLimiter,
  (req, res, next) => {
    const schema = Joi.object({
      password: passwordComplexity,
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm Password"),
    });

    const { error } = schema.validate(req.body);
    customErrorHandler(error, req, res, next);
  },
];

// Update User Profile Validation
export const validateUpdateUserProfile = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).label("Name"),
    // Add other fields like bio, avatar, etc. with their respective validation.
  });

  const { error } = schema.validate(req.body);
  customErrorHandler(error, req, res, next);
};

// Stream Creation/Update Validation
export const validateStream = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required().label("Stream Name"),
    description: Joi.string().min(10).required().label("Description"),
    fee: Joi.number().min(0).required().label("Fee"),
    feeType: Joi.string()
      .valid("one-time", "per-minute")
      .required()
      .label("Fee Type"), // Added this line
  });

  const { error } = schema.validate(req.body);
  customErrorHandler(error, req, res, next);
};

export const validateCreateLocation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
