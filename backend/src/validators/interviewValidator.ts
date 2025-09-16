import Joi from 'joi';
import { InterviewStatusEnum } from '../enums/interviewStatusEnum';

const InterviewValidator = Joi.object({
  candidateId: Joi.number().integer().positive().required(),
  scheduleDate: Joi.date().required(),
  duration: Joi.number()
    .integer()
    .min(15)
    .max(60)
    .required()
    .messages({
      'number.min': 'Duration must be at least 15 minutes',
      'number.max': 'Duration cannot exceed 60 minutes'
    }),
  status: Joi.string()
    .valid(
      InterviewStatusEnum.SCHEDULED,
      InterviewStatusEnum.COMPLETED,
      InterviewStatusEnum.CANCELLED
    )
    .default(InterviewStatusEnum.SCHEDULED),
  feedback: Joi.string().allow(null).allow('').optional(),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .allow(null)
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5'
    })
});

export { InterviewValidator };