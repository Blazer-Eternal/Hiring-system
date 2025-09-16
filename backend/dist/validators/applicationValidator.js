"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const applicationStatusEnum_1 = require("../enums/applicationStatusEnum");
const ApplicationValidator = joi_1.default.object({
    candidateId: joi_1.default.number().integer().positive().required(),
    jobId: joi_1.default.number().integer().positive().required(),
    interviewId: joi_1.default.number().integer().positive().required(),
    status: joi_1.default.string()
        .valid(applicationStatusEnum_1.ApplicationStatusEnum.APPLIED, applicationStatusEnum_1.ApplicationStatusEnum.UNDER_REVIEW, applicationStatusEnum_1.ApplicationStatusEnum.INTERVIEW, applicationStatusEnum_1.ApplicationStatusEnum.HIRED, applicationStatusEnum_1.ApplicationStatusEnum.REJECTED),
    createdAt: joi_1.default.date().default(Date.now),
    updatedAt: joi_1.default.date().default(Date.now)
});
exports.ApplicationValidator = ApplicationValidator;
