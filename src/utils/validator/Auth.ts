import * as Joi from "joi";

export const registerSchema = Joi.object().keys({
  username: Joi.string(),
  full_name: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string(),
  password: Joi.string(),
});
