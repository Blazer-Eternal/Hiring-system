"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const interviewStatusEnum_1 = require("../enums/interviewStatusEnum");
const InterviewValidator = joi_1.default.object({
    candidateId: joi_1.default.number().integer().positive().required(),
    scheduleDate: joi_1.default.date().required(),
    duration: joi_1.default.number()
        .integer()
        .min(15)
        .max(60)
        .required()
        .messages({
        'number.min': 'Duration must be at least 15 minutes',
        'number.max': 'Duration cannot exceed 60 minutes'
    }),
    status: joi_1.default.string()
        .valid(interviewStatusEnum_1.InterviewStatusEnum.SCHEDULED, interviewStatusEnum_1.InterviewStatusEnum.COMPLETED, interviewStatusEnum_1.InterviewStatusEnum.CANCELLED)
        .default(interviewStatusEnum_1.InterviewStatusEnum.SCHEDULED),
    feedback: joi_1.default.string().allow(null).allow('').optional(),
    rating: joi_1.default.number()
        .integer()
        .min(1)
        .max(5)
        .allow(null)
        .messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5'
    })
});
exports.InterviewValidator = InterviewValidator;
