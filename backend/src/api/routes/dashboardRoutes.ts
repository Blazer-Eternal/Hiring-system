import { Router } from "express";
import { DashboardController } from "../controllers/dashboardControllers";
import { RoleEnum } from "../../enums/roleEnum";

const router = Router();
const dashboardController = new DashboardController();

// Admin dashboard route
router.get("/admin", dashboardController.getAdminStats);

// User dashboard route
router.get("/user/:userId", dashboardController.getUserStats);

export default router;
