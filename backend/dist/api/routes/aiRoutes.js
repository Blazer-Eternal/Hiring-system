"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const aiControllers_1 = require("../controllers/aiControllers");
const roleEnum_1 = require("../../enums/roleEnum");
const aiRoutes = (0, express_1.Router)();
// ── Chatbot — any authenticated user ─────────────────────────────────────────
aiRoutes.post("/chat", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.chat));
// FAQ is public — no auth needed
aiRoutes.get("/chat/faq", (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.getFAQ));
// ── Resume Parser — user only ─────────────────────────────────────────────────
aiRoutes.post("/resume/parse", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.parseResume));
// ── Job Matching (TF-IDF) ─────────────────────────────────────────────────────
// User: ranked jobs for their profile
aiRoutes.get("/jobs/match", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.matchJobsForCandidate));
// Recruiter: ranked candidates for a specific job
aiRoutes.get("/jobs/:jobId/candidates", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.matchCandidatesForJob));
// ── Personalization — user only ───────────────────────────────────────────────
aiRoutes.get("/recommendations", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.getRecommendations));
aiRoutes.get("/profile/completeness", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.getProfileCompleteness));
// ── Duplicate Detection — admin only ─────────────────────────────────────────
aiRoutes.post("/applications/duplicates", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(aiControllers_1.AIController.findDuplicateApplications));
exports.default = aiRoutes;
