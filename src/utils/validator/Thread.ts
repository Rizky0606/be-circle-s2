import * as Joi from "joi";

export const createThreadsSchema = Joi.object({
  content: Joi.string(),
  image: Joi.string().allow("", null),
  userId: Joi.number(),
});

export const updateThreadsSchema = Joi.object({
  content: Joi.string(),
  image: Joi.string(),
});
