import { Router } from "express";
import { CandidateController } from "../controllers/candidateControllers";
import { CandidateValidator } from "../../validators";
import { exceptionHandler, Validator, Guard } from "../../middleware";
import { RoleEnum } from "../../enums/roleEnum";

const candidateRoutes = Router();

// ── User (candidate) ──────────────────────────────────────────────────────────
// View own profile
candidateRoutes.get(
  "/me",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(CandidateController.getMyProfile)
);

// Create own profile
candidateRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(Validator.check(CandidateValidator)),
  exceptionHandler(CandidateController.createCandidate)
);

// Update own profile
candidateRoutes.put(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user, RoleEnum.admin)),
  exceptionHandler(Validator.check(CandidateValidator)),
  exceptionHandler(CandidateController.updateCandidate)
);

// ── Admin ─────────────────────────────────────────────────────────────────────
// View all candidates
candidateRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin, RoleEnum.recruiter)),
  exceptionHandler(CandidateController.getAllCandidates)
);

// Delete a candidate
candidateRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(CandidateController.deleteCandidate)
);

// View candidate by ID (admin + recruiter)
candidateRoutes.get(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin, RoleEnum.recruiter)),
  exceptionHandler(CandidateController.getCandidateById)
);

export default candidateRoutes;
