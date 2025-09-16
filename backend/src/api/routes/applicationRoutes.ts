import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { ApplicationValidator } from "../../validators";
import { ApplicationController } from "../controllers/ApplicationControllers";

const applicationRoutes = Router();

// Submit new application
applicationRoutes.post("/", 
    exceptionHandler(Validator.check(ApplicationValidator)),
    exceptionHandler(ApplicationController.createApplication)
);

// List all applications (with filters)
applicationRoutes.get("/", ApplicationController.getAllApplications);

// Get application details
applicationRoutes.get("/:id", ApplicationController.getApplicationById);

// Update application
applicationRoutes.put("/:id", ApplicationController.updateApplication);

// Update application status
applicationRoutes.patch("/:id/status", ApplicationController.updateApplicationStatus);

// Get applications for specific job
applicationRoutes.get("/jobs/:id/applications", ApplicationController.getApplicationsByJob);

// Get applications for specific candidate
applicationRoutes.get("/candidates/:id/applications", ApplicationController.getApplicationsByCandidate);

applicationRoutes.get("/interviews/:id/applications", ApplicationController.getApplicationsByInterview);

export default applicationRoutes;