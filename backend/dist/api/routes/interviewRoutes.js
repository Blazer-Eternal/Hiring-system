"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const interviewControllers_1 = require("../controllers/interviewControllers");
const roleEnum_1 = require("../../enums/roleEnum");
const interviewRoutes = (0, express_1.Router)();
// ── Recruiter: schedule an interview for a candidate ──────────────────────────
interviewRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.InterviewValidator)), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.scheduleInterview));
// ── All authenticated: view interviews (filtered by role in controller) ────────
// User sees own schedule + status (scheduled/rejected/hired)
// Recruiter sees interviews they created
// Admin sees all
interviewRoutes.get("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.getAllInterviews));
interviewRoutes.get("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.getInterviewDetails));
// ── Recruiter / Admin: update interview schedule ──────────────────────────────
interviewRoutes.put("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.updateInterview));
// ── Recruiter / Admin: mark completed or cancelled ───────────────────────────
interviewRoutes.patch("/:id/status", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.updateInterviewStatus));
// ── Recruiter: add feedback + rating after interview ─────────────────────────
interviewRoutes.patch("/:id/feedback", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(interviewControllers_1.InterviewController.updateInterviewFeedback));
exports.default = interviewRoutes;
