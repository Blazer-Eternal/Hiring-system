"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../../middleware");
const roleEnum_1 = require("../../enums/roleEnum");
const router = (0, express_1.Router)();
// ── Recruiter: own profile ────────────────────────────────────────────────────
router.get("/me", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.getMyProfile));
router.put("/me", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.updateMyProfile));
router.get("/applications", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.viewApplications));
router.get("/interviews", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.viewInterviews));
// ── Admin: verification management ───────────────────────────────────────────
// Pending recruiters awaiting approval (shown in admin dashboard)
router.get("/pending", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.getPendingRecruiters));
// Verified recruiters
router.get("/verified", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.getVerifiedRecruiters));
// Approve a recruiter (checkbox accept)
router.patch("/:id/approve", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.approveRecruiter));
// Reject a recruiter (checkbox reject — deletes record)
router.delete("/:id/reject", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.rejectRecruiter));
// ── Admin: general management ─────────────────────────────────────────────────
router.get("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.getAllRecruiters));
router.delete("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.deleteRecruiter));
router.get("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin, roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(controllers_1.RecruiterControllers.getRecruiterById));
exports.default = router;
