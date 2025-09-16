import Joi from 'joi';
import { JobStatusEnum } from '../enums/jobStatusEnum'; 

const jobPostionValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  department: Joi.string().required(),
  location: Joi.string().required(),
  salaryRange: Joi.string().required(),
  status: Joi.string()
    .valid(
      JobStatusEnum.OPEN,
      JobStatusEnum.CLOSED
    )
    .default(JobStatusEnum.OPEN)
});

export { jobPostionValidator };