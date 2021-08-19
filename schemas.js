const Joi = require("joi");

module.exports.greenspaceSchema = Joi.object({
  greenspace: Joi.object({
    title: Joi.string().required(),
    fee: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
});
