"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const CandidateValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string()
        .pattern(/^[0-9]{10,15}$/) // Basic phone number validation
        .required(),
    skills: joi_1.default.string().required(),
    experience: joi_1.default.number().min(0).required() // FLOAT translates to number in Joi
});
exports.CandidateValidator = CandidateValidator;
