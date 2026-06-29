"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const recruiterValidator_1 = require("../../validators/recruiterValidator");
const authControllers_1 = require("../controllers/authControllers");
const recruiterAuthControllers_1 = require("../controllers/recruiterAuthControllers");
const authRoutes = (0, express_1.Router)();
// ── User auth ─────────────────────────────────────────────────────────────────
authRoutes.post("/signup", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.signupValidator)), (0, middleware_1.exceptionHandler)(authControllers_1.AuthController.signup));
authRoutes.post("/login", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.loginValidator)), (0, middleware_1.exceptionHandler)(authControllers_1.AuthController.login));
authRoutes.post("/logout", (0, middleware_1.exceptionHandler)(authControllers_1.AuthController.logout));
// ── Recruiter auth (separate table, separate credentials) ─────────────────────
authRoutes.post("/recruiter/signup", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(recruiterValidator_1.recruiterSignupValidator)), (0, middleware_1.exceptionHandler)(recruiterAuthControllers_1.RecruiterAuthController.signup));
authRoutes.post("/recruiter/login", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(recruiterValidator_1.recruiterLoginValidator)), (0, middleware_1.exceptionHandler)(recruiterAuthControllers_1.RecruiterAuthController.login));
authRoutes.post("/recruiter/logout", (0, middleware_1.exceptionHandler)(recruiterAuthControllers_1.RecruiterAuthController.logout));
exports.default = authRoutes;
