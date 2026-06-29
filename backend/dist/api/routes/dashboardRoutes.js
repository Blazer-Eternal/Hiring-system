"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardControllers_1 = require("../controllers/dashboardControllers");
const middleware_1 = require("../../middleware");
const roleEnum_1 = require("../../enums/roleEnum");
const dashboardRoutes = (0, express_1.Router)();
// Admin: full system overview — all users, hired/rejected, interview schedules, recruiter list
dashboardRoutes.get("/admin", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(dashboardControllers_1.DashboardController.getAdminStats));
// Recruiter: own pipeline, job performance, upcoming interviews
dashboardRoutes.get("/recruiter", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.recruiter)), (0, middleware_1.exceptionHandler)(dashboardControllers_1.DashboardController.getRecruiterStats));
// User/Candidate: own applications, interview schedule, rejections, offers
dashboardRoutes.get("/user", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.user)), (0, middleware_1.exceptionHandler)(dashboardControllers_1.DashboardController.getUserStats));
exports.default = dashboardRoutes;
