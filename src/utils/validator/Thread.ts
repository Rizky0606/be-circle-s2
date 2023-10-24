import * as Joi from "joi";

export const createThreadsSchema = Joi.object({
  content: Joi.string().min(5).required(),
  Image: Joi.string(),
  userId: Joi.number(),
});

export const updateThreadsSchema = Joi.object({
  content: Joi.string().min(5).required(),
  Image: Joi.string(),
});
