import { Router } from "express";
import { DashboardController } from "../controllers/dashboardControllers";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get("/admin", dashboardController.getAdminStats);

dashboardRoutes.get("/user/:userId", dashboardController.getUserStats);

export default dashboardRoutes;
