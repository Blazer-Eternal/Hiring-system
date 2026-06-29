import { Router } from "express";
import { RecruiterControllers } from "../controllers";
import { exceptionHandler, Guard } from "../../middleware";
import { RoleEnum } from "../../enums/roleEnum";

const router = Router();

// ── Recruiter: own profile ────────────────────────────────────────────────────
router.get("/me",           exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.recruiter)), exceptionHandler(RecruiterControllers.getMyProfile));
router.put("/me",           exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.recruiter)), exceptionHandler(RecruiterControllers.updateMyProfile));
router.get("/applications", exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.recruiter)), exceptionHandler(RecruiterControllers.viewApplications));
router.get("/interviews",   exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.recruiter)), exceptionHandler(RecruiterControllers.viewInterviews));

// ── Admin: verification management ───────────────────────────────────────────
// Pending recruiters awaiting approval (shown in admin dashboard)
router.get("/pending",      exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)), exceptionHandler(RecruiterControllers.getPendingRecruiters));

// Verified recruiters
router.get("/verified",     exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)), exceptionHandler(RecruiterControllers.getVerifiedRecruiters));

// Approve a recruiter (checkbox accept)
router.patch("/:id/approve",exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)), exceptionHandler(RecruiterControllers.approveRecruiter));

// Reject a recruiter (checkbox reject — deletes record)
router.delete("/:id/reject",exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)), exceptionHandler(RecruiterControllers.rejectRecruiter));

// ── Admin: general management ─────────────────────────────────────────────────
router.get("/",             exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)),                                exceptionHandler(RecruiterControllers.getAllRecruiters));
router.delete("/:id",       exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin)),                                exceptionHandler(RecruiterControllers.deleteRecruiter));
router.get("/:id",          exceptionHandler(Guard.grantAccess), exceptionHandler(Guard.grantRole(RoleEnum.admin, RoleEnum.recruiter)),             exceptionHandler(RecruiterControllers.getRecruiterById));

export default router;
