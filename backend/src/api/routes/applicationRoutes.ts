import { Router } from "express";
import { exceptionHandler, Guard } from "../../middleware";
import { ApplicationController } from "../controllers/ApplicationControllers";
import { RoleEnum } from "../../enums/roleEnum";

const applicationRoutes = Router();

// ── Static routes FIRST (before /:id) ────────────────────────────────────────

// User: view own applications (pipeline status, rejections, offers)
applicationRoutes.get(
  "/my",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(ApplicationController.getMyApplications)
);

// Recruiter: ranked candidates for a job by CV match score (TF-IDF)
applicationRoutes.get(
  "/jobs/:jobId/ranked",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(ApplicationController.getRankedCandidatesForJob)
);

// Recruiter / Admin: applications by job
applicationRoutes.get(
  "/jobs/:jobId/applications",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(ApplicationController.getApplicationsByJob)
);

// Admin / Recruiter: applications by candidate
applicationRoutes.get(
  "/candidates/:candidateId/applications",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin, RoleEnum.recruiter)),
  exceptionHandler(ApplicationController.getApplicationsByCandidate)
);

// Admin / Recruiter: applications by interview
applicationRoutes.get(
  "/interviews/:interviewId/applications",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin, RoleEnum.recruiter)),
  exceptionHandler(ApplicationController.getApplicationsByInterview)
);

// All roles: list (filtered by role in controller)
applicationRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(ApplicationController.getAllApplications)
);

// ── User: apply for a job ─────────────────────────────────────────────────────
applicationRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(ApplicationController.createApplication)
);

// ── Recruiter / Admin: update application status ──────────────────────────────
applicationRoutes.patch(
  "/:id/status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(ApplicationController.updateApplicationStatus)
);

// ── Param route LAST ──────────────────────────────────────────────────────────
applicationRoutes.get(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(ApplicationController.getApplicationById)
);

export default applicationRoutes;
