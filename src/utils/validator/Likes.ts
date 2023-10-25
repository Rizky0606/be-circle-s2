import * as Joi from "joi";

export const createLikeSchema = Joi.object({
  userId: Joi.number().required(),
  threadsId: Joi.number().required(),
});
