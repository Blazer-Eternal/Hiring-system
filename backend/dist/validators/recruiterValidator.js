"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecruiter = exports.recruiterLoginValidator = exports.recruiterSignupValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const recruiterSignupValidator = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    phoneNumber: joi_1.default.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .required()
        .messages({ 'string.pattern.base': 'Please provide a valid phone number' }),
    location: joi_1.default.string().required(),
});
exports.recruiterSignupValidator = recruiterSignupValidator;
exports.validateRecruiter = recruiterSignupValidator;
const recruiterLoginValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.recruiterLoginValidator = recruiterLoginValidator;
