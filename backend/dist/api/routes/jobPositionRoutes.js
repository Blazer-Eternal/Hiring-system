"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const jobPositionControllers_1 = require("../controllers/jobPositionControllers");
const jobRoutes = (0, express_1.Router)();
// Create a new job position
jobRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.jobPostionValidator)), (0, middleware_1.exceptionHandler)(jobPositionControllers_1.JobController.createJob));
// Get all job positions
jobRoutes.get("/", jobPositionControllers_1.JobController.getAllJobs);
// Get a specific job by ID
jobRoutes.get("/:id", jobPositionControllers_1.JobController.getJobById);
// Update a job position
jobRoutes.put("/:id", jobPositionControllers_1.JobController.updateJob);
// Delete a job position
jobRoutes.delete("/:id", jobPositionControllers_1.JobController.deleteJob);
exports.default = jobRoutes;
