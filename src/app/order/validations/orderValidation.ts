import Joi from 'joi';

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0).required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
});
