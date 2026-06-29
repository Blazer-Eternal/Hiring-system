import { Router } from "express";
import { exceptionHandler, Validator, Guard } from "../../middleware";
import { InterviewValidator } from "../../validators";
import { InterviewController } from "../controllers/interviewControllers";
import { RoleEnum } from "../../enums/roleEnum";

const interviewRoutes = Router();

// ── Recruiter: schedule an interview for a candidate ──────────────────────────
interviewRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter)),
  exceptionHandler(Validator.check(InterviewValidator)),
  exceptionHandler(InterviewController.scheduleInterview)
);

// ── All authenticated: view interviews (filtered by role in controller) ────────
// User sees own schedule + status (scheduled/rejected/hired)
// Recruiter sees interviews they created
// Admin sees all
interviewRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(InterviewController.getAllInterviews)
);

interviewRoutes.get(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(InterviewController.getInterviewDetails)
);

// ── Recruiter / Admin: update interview schedule ──────────────────────────────
interviewRoutes.put(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(InterviewController.updateInterview)
);

// ── Recruiter / Admin: mark completed or cancelled ───────────────────────────
interviewRoutes.patch(
  "/:id/status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(InterviewController.updateInterviewStatus)
);

// ── Recruiter: add feedback + rating after interview ─────────────────────────
interviewRoutes.patch(
  "/:id/feedback",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(InterviewController.updateInterviewFeedback)
);

export default interviewRoutes;
