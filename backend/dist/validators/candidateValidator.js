"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
// Used for both create and update — all fields optional on update
const CandidateValidator = joi_1.default.object({
    name: joi_1.default.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be less than 100 characters',
    }),
    email: joi_1.default.string()
        .email()
        .optional()
        .messages({
        'string.email': 'Please provide a valid email address',
    }),
    phoneNumber: joi_1.default.string()
        .min(7)
        .max(20)
        .optional()
        .messages({
        'string.min': 'Phone number is too short',
        'string.max': 'Phone number is too long',
    }),
    temporaryAddress: joi_1.default.string().optional().allow(''),
    permanentAddress: joi_1.default.string().optional().allow(''),
    cvUrl: joi_1.default.alternatives()
        .try(joi_1.default.string().uri(), joi_1.default.string().allow(''))
        .optional(),
});
exports.CandidateValidator = CandidateValidator;
