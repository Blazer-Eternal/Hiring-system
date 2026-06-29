"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const ApplicationControllers_1 = require("../controllers/ApplicationControllers");
const roleEnum_1 = require("../../enums/roleEnum");
const applicationRoutes = (0, express_1.Router)();
// ── Static routes FIRST (before /:id) ────────────────────────────────────────
// User: view own applications (pipeline status, rejections, offers)
applicationRoutes.get("/my", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getMyApplications));
// Recruiter: ranked candidates for a job by CV match score (TF-IDF)
applicationRoutes.get("/jobs/:jobId/ranked", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getRankedCandidatesForJob));
// Recruiter / Admin: applications by job
applicationRoutes.get("/jobs/:jobId/applications", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getApplicationsByJob));
// Admin / Recruiter: applications by candidate
applicationRoutes.get("/candidates/:candidateId/applications", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getApplicationsByCandidate));
// Admin / Recruiter: applications by interview
applicationRoutes.get("/interviews/:interviewId/applications", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getApplicationsByInterview));
// All roles: list (filtered by role in controller)
applicationRoutes.get("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getAllApplications));
// ── User: apply for a job ─────────────────────────────────────────────────────
applicationRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.createApplication));
// ── Recruiter / Admin: update application status ──────────────────────────────
applicationRoutes.patch("/:id/status", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.updateApplicationStatus));
// ── Param route LAST ──────────────────────────────────────────────────────────
applicationRoutes.get("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.getApplicationById));
exports.default = applicationRoutes;
