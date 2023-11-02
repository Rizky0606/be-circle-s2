import * as Joi from "joi";

export const createRepliesSchema = Joi.object({
  content: Joi.string(),
  userId: Joi.number(),
  threadsId: Joi.number(),
  // likeId: Joi.number(),
});

export const updateRepliesSchema = Joi.object({
  content: Joi.string().min(5),
});
