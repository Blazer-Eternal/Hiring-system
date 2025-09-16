import Joi from 'joi';
import { ApplicationStatusEnum } from '../enums/applicationStatusEnum'; 

const ApplicationValidator = Joi.object({
  candidateId: Joi.number().integer().positive().required(),
  jobId: Joi.number().integer().positive().required(),
  interviewId: Joi.number().integer().positive().required(),
  status: Joi.string()
    .valid(
      ApplicationStatusEnum.APPLIED,
      ApplicationStatusEnum.UNDER_REVIEW,
      ApplicationStatusEnum.INTERVIEW,
      ApplicationStatusEnum.HIRED,
      ApplicationStatusEnum.REJECTED
    ),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});

export { ApplicationValidator };