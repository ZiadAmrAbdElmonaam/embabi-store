import Joi from 'joi';

// Sign-Up Validation Schema
export const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have a minimum length of {#limit}',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('user', 'admin').optional(),
});

// Sign-In Validation Schema
export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
});

// Forgot Password Validation Schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
});

// Reset Password Validation Schema
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  code: Joi.string().length(6).required().messages({
    'string.length': 'Reset code must be 6 digits',
    'any.required': 'Reset code is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password cannot be empty',
    'string.min': 'New password should have a minimum length of {#limit}',
    'any.required': 'New password is required',
  }),
});