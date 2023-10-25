import * as Joi from "joi";

export const createRepliesSchema = Joi.object({
  content: Joi.string().min(5),
  userId: Joi.number().required(),
  threadsId: Joi.number().required(),
});

export const updateRepliesSchema = Joi.object({
  content: Joi.string().min(5),
});
