"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardControllers_1 = require("../controllers/dashboardControllers");
const router = (0, express_1.Router)();
const dashboardController = new dashboardControllers_1.DashboardController();
// Admin dashboard route
router.get("/admin", dashboardController.getAdminStats);
// User dashboard route
router.get("/user/:userId", dashboardController.getUserStats);
exports.default = router;
