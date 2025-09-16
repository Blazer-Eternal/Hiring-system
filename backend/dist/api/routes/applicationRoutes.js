"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const ApplicationControllers_1 = require("../controllers/ApplicationControllers");
const applicationRoutes = (0, express_1.Router)();
// Submit new application
applicationRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.ApplicationValidator)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.createApplication));
// List all applications (with filters)
applicationRoutes.get("/", ApplicationControllers_1.ApplicationController.getAllApplications);
// Get application details
applicationRoutes.get("/:id", ApplicationControllers_1.ApplicationController.getApplicationById);
// Update application
applicationRoutes.put("/:id", ApplicationControllers_1.ApplicationController.updateApplication);
// Update application status
applicationRoutes.patch("/:id/status", ApplicationControllers_1.ApplicationController.updateApplicationStatus);
// Get applications for specific job
applicationRoutes.get("/jobs/:id/applications", ApplicationControllers_1.ApplicationController.getApplicationsByJob);
// Get applications for specific candidate
applicationRoutes.get("/candidates/:id/applications", ApplicationControllers_1.ApplicationController.getApplicationsByCandidate);
applicationRoutes.get("/interviews/:id/applications", ApplicationControllers_1.ApplicationController.getApplicationsByInterview);
exports.default = applicationRoutes;
