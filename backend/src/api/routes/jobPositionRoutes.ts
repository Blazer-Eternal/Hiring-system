import { Router } from "express";
import { exceptionHandler, Validator, Guard } from "../../middleware";
import { jobPostionValidator } from "../../validators";
import { JobController } from "../controllers/jobPositionControllers";
import { RoleEnum } from "../../enums/roleEnum";

const jobRoutes = Router();

// ── Public — anyone can browse open jobs ──────────────────────────────────────
jobRoutes.get("/", exceptionHandler(JobController.getAllJobs));

// ── Recruiter ─────────────────────────────────────────────────────────────────
// IMPORTANT: /my/jobs must be BEFORE /:id — otherwise "my" gets treated as an id
jobRoutes.get(
  "/my/jobs",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter)),
  exceptionHandler(JobController.getMyJobs)
);

// Public: get by id — must come AFTER /my/jobs
jobRoutes.get("/:id", exceptionHandler(JobController.getJobById));

// Post a new job
jobRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter)),
  exceptionHandler(Validator.check(jobPostionValidator)),
  exceptionHandler(JobController.createJob)
);

// Update a job
jobRoutes.put(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(JobController.updateJob)
);

// Delete a job
jobRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter, RoleEnum.admin)),
  exceptionHandler(JobController.deleteJob)
);

export default jobRoutes;
