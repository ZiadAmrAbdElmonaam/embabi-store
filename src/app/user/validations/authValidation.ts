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