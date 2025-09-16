import Joi from 'joi';

const CandidateValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // Basic phone number validation
    .required(),
  skills: Joi.string().required(),
  experience: Joi.number().min(0).required() // FLOAT translates to number in Joi
});

export { CandidateValidator };