import Joi from 'joi';

export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(), // Assuming product is a string (ObjectId as string)
      quantity: Joi.number().integer().min(1).required(), // Quantity should be a positive integer
    })
  ).required(),
  
  totalPrice: Joi.number().positive().required() // Total price should be a positive number
});