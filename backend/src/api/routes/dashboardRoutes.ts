import { Router } from "express";
import { DashboardController } from "../controllers/dashboardControllers";
import { exceptionHandler, Guard } from "../../middleware";
import { RoleEnum } from "../../enums/roleEnum";

const dashboardRoutes = Router();

// Admin: full system overview — all users, hired/rejected, interview schedules, recruiter list
dashboardRoutes.get(
  "/admin",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(DashboardController.getAdminStats)
);

// Recruiter: own pipeline, job performance, upcoming interviews
dashboardRoutes.get(
  "/recruiter",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.recruiter)),
  exceptionHandler(DashboardController.getRecruiterStats)
);

// User/Candidate: own applications, interview schedule, rejections, offers
dashboardRoutes.get(
  "/user",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.user)),
  exceptionHandler(DashboardController.getUserStats)
);

export default dashboardRoutes;
