"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardControllers_1 = require("../controllers/dashboardControllers");
const dashboardRoutes = (0, express_1.Router)();
const dashboardController = new dashboardControllers_1.DashboardController();
dashboardRoutes.get("/admin", dashboardController.getAdminStats);
dashboardRoutes.get("/user/:userId", dashboardController.getUserStats);
exports.default = dashboardRoutes;
