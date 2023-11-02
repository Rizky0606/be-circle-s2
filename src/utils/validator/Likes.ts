import * as Joi from "joi";

export const createLikeSchema = Joi.object({
  userId: Joi.number(),
  threadsId: Joi.number(),
  repliesId: Joi.number(),
});
