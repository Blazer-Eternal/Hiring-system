"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidator = void 0;
// In your validators/candidate.validator.ts (or similar)
const joi_1 = __importDefault(require("joi"));
const CandidateValidator = joi_1.default.object({
    name: joi_1.default.string()
        .min(2)
        .max(100)
        .required()
        .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be less than 100 characters'
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
    }),
    phone: joi_1.default.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Please provide a valid phone number'
    }),
    resumeUrl: joi_1.default.string()
        .uri()
        .optional()
        .messages({
        'string.uri': 'Please provide a valid URL'
    }),
    skills: joi_1.default.array()
        .items(joi_1.default.string())
        .optional()
});
exports.CandidateValidator = CandidateValidator;
