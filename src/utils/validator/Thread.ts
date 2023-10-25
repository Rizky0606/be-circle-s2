import * as Joi from "joi";

export const createThreadsSchema = Joi.object({
  content: Joi.string().min(5).required(),
  image: Joi.string(),
  userId: Joi.number().required(),
});

export const updateThreadsSchema = Joi.object({
  content: Joi.string().min(5).required(),
  image: Joi.string(),
});
