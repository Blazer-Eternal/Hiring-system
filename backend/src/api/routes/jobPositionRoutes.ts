import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { jobPostionValidator } from "../../validators";
import { JobController } from "../controllers/jobPositionControllers";

const jobRoutes = Router();

// Create a new job position
jobRoutes.post("/", 
    exceptionHandler(Validator.check(jobPostionValidator)),
    exceptionHandler(JobController.createJob)
);

// Get all job positions
jobRoutes.get("/", JobController.getAllJobs);

// Get a specific job by ID
jobRoutes.get("/:id", JobController.getJobById);

// Update a job position
jobRoutes.put("/:id", JobController.updateJob);

// Delete a job position
jobRoutes.delete("/:id", JobController.deleteJob);



export default jobRoutes;