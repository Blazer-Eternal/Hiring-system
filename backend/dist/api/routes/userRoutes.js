"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const middleware_1 = require("../../middleware");
const roleEnum_1 = require("../../enums/roleEnum");
const userRoutes = (0, express_1.Router)();
// Admin: view all users
userRoutes.get("/", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(userControllers_1.UserController.getAllUsers));
// Admin: assign role to a user (e.g. promote to recruiter)
userRoutes.patch("/:id/role", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(userControllers_1.UserController.assignRole));
// Admin: delete a user
userRoutes.delete("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantAccess), (0, middleware_1.exceptionHandler)(middleware_1.Guard.grantRole(roleEnum_1.RoleEnum.admin)), (0, middleware_1.exceptionHandler)(userControllers_1.UserController.deleteUser));
exports.default = userRoutes;
