const Joi = require("joi");

module.exports.greenspaceSchema = Joi.object({
  greenspace: Joi.object({
    title: Joi.string().required(),
    fee: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
  }).required()
});
