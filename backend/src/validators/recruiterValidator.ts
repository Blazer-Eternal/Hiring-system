import Joi from 'joi';

const recruiterSignupValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({ 'string.pattern.base': 'Please provide a valid phone number' }),
  location: Joi.string().required(),
});

const recruiterLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { recruiterSignupValidator, recruiterLoginValidator };
export { recruiterSignupValidator as validateRecruiter };
