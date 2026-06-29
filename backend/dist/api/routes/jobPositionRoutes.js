"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const jobPositionControllers_1 = require("../controllers/jobPositionControllers");
const roleEnum_1 = require("../../enums/roleEnum");
const jobRoutes = (0, express_1.Router)();
// ── Public — anyone can browse open jobs ──────────────────────────────────────
jobRoutes.get("/", (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.getAllJobs));
// ── Recruiter ─────────────────────────────────────────────────────────────────
// IMPORTANT: /my/jobs must be BEFORE /:id — otherwise "my" gets treated as an id
jobRoutes.get("/my/jobs", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.getMyJobs));
// Public: get by id — must come AFTER /my/jobs
jobRoutes.get("/:id", (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.getJobById));
// Post a new job
jobRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.jobPostionValidator)), (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.createJob));
// Update a job
jobRoutes.put("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.updateJob));
// Delete a job
jobRoutes.delete("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.deleteJob));
exports.default = jobRoutes;
