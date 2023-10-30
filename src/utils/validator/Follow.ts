import * as Joi from "joi";

export const createFollowingSchema = Joi.object({
  id: Joi.number().required(),
  followingId: Joi.number().required(),
  followersId: Joi.number().required(),
});

export const createFollowerSchema = Joi.object({
  id: Joi.number().required(),
  followersId: Joi.number().required(),
  followingId: Joi.number().required(),
});
