import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        colors: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0).required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'ordered', 'prepared', 'shipped', 'cancelled', 'delivered')
    .required(),
});