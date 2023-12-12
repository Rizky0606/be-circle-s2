import * as Joi from "joi";

export const createUsersSchema = Joi.object({
  username: Joi.string().min(5),
  full_name: Joi.string().min(5),
  email: Joi.string().min(5),
  password: Joi.string().min(5),
  photo_profile: Joi.string(),
  bio: Joi.string().min(5),
});

export const updateUsersSchema = Joi.object({
  username: Joi.string().min(5),
  full_name: Joi.string().min(5),
  email: Joi.string().min(5),
  password: Joi.string().min(5),
  photo_profile: Joi.string(),
  bio: Joi.string().min(5),
});
