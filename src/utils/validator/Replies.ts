import * as Joi from "joi";

export const createRepliesSchema = Joi.object({
  content: Joi.string(),
  image: Joi.string(),
  userId: Joi.number().required(),
  threadsId: Joi.number().required(),
  likeId: Joi.number(),
});

export const updateRepliesSchema = Joi.object({
  content: Joi.string().min(5),
});
