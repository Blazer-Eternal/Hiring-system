"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobPostionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const jobStatusEnum_1 = require("../enums/jobStatusEnum");
const jobPostionValidator = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    requirements: joi_1.default.string().required(),
    department: joi_1.default.string().required(),
    location: joi_1.default.string().required(),
    salaryRange: joi_1.default.string().required(),
    status: joi_1.default.string()
        .valid(jobStatusEnum_1.JobStatusEnum.OPEN, jobStatusEnum_1.JobStatusEnum.CLOSED)
        .default(jobStatusEnum_1.JobStatusEnum.OPEN)
});
exports.jobPostionValidator = jobPostionValidator;
