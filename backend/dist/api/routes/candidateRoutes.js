"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateControllers_1 = require("../controllers/candidateControllers");
const validators_1 = require("../../validators");
const middleware_1 = require("../../middleware");
const roleEnum_1 = require("../../enums/roleEnum");
const candidateRoutes = (0, express_1.Router)();
// ── User (candidate) ──────────────────────────────────────────────────────────
// View own profile
candidateRoutes.get("/me", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.getMyProfile));
// Create own profile
candidateRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.CandidateValidator)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.createCandidate));
// Update own profile
candidateRoutes.put("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user, roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.CandidateValidator)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.updateCandidate));
// ── Admin ─────────────────────────────────────────────────────────────────────
// View all candidates
candidateRoutes.get("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.getAllCandidates));
// Delete a candidate
candidateRoutes.delete("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.deleteCandidate));
// View candidate by ID (admin + recruiter)
candidateRoutes.get("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.getCandidateById));
exports.default = candidateRoutes;
