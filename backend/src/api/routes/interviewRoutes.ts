import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { InterviewValidator } from "../../validators";
import { InterviewController } from "../controllers/interviewControllers";

const interviewRoutes = Router();

interviewRoutes.post("/", 
    exceptionHandler(Validator.check(InterviewValidator)),
    exceptionHandler(InterviewController.scheduleInterview)
    );

interviewRoutes.get("/", InterviewController.getAllInterviews);
interviewRoutes.get("/:id", InterviewController.getInterviewDetails);
interviewRoutes.put("/:id", InterviewController.updateInterview);
interviewRoutes.patch("/:id/status", InterviewController.updateInterviewStatus);
interviewRoutes.patch("/:id/feedback", InterviewController.updateInterviewFeedback);
// interviewRoutes.get("/applications/:id/interviews", InterviewController.getApplicationInterviews);

export default interviewRoutes;