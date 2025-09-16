"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const roleEnum_1 = require("../enums/roleEnum");
const signupValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.user)
});
exports.signupValidator = signupValidator;
const loginValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.loginValidator = loginValidator;
