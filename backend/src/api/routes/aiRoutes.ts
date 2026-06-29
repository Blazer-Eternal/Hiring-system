import { Router } from "express";
import { exceptionHandler, Guard } from "../../middleware";
import { AIController } from "../controllers/aiControllers";
import { RoleEnum } from "../../enums/roleEnum";

const aiRoutes = Router();

// ── Chatbot — any authenticated user ─────────────────────────────────────────
aiRoutes.post(
  "/chat",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(AIController.chat)
);

// FAQ is public — no auth needed
aiRoutes.get("/chat/faq", exceptionHandler(AIController.getFAQ));

// ── Resume Parser — user only ─────────────────────────────────────────────────
aiRoutes.post(
  "/resume/parse",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(AIController.parseResume)
);

// ── Job Matching (TF-IDF) ─────────────────────────────────────────────────────
// User: ranked jobs for their profile
aiRoutes.get(
  "/jobs/match",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(AIController.matchJobsForCandidate)
);

// Recruiter: ranked candidates for a specific job
aiRoutes.get(
  "/jobs/:jobId/candidates",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter)),
  exceptionHandler(AIController.matchCandidatesForJob)
);

// ── Personalization — user only ───────────────────────────────────────────────
aiRoutes.get(
  "/recommendations",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(AIController.getRecommendations)
);

aiRoutes.get(
  "/profile/completeness",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(AIController.getProfileCompleteness)
);

// ── Duplicate Detection — admin only ─────────────────────────────────────────
aiRoutes.post(
  "/applications/duplicates",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(AIController.findDuplicateApplications)
);

export default aiRoutes;
