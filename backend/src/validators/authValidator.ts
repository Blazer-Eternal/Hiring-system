import Joi from 'joi';

const signupValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    // role is NOT accepted at signup — all users register as 'user' by default
    // Admin assigns recruiter/admin roles separately
});

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export { signupValidator, loginValidator }
