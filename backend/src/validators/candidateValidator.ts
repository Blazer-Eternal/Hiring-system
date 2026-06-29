import Joi from 'joi';

// Used for both create and update — all fields optional on update
const CandidateValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be less than 100 characters',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  phoneNumber: Joi.string()
    .min(7)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Phone number is too short',
      'string.max': 'Phone number is too long',
    }),
  temporaryAddress: Joi.string().optional().allow(''),
  permanentAddress: Joi.string().optional().allow(''),
  cvUrl: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().allow(''))
    .optional(),
});

export { CandidateValidator };
