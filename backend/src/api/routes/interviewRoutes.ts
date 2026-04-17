import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { InterviewValidator } from "../../validators";
import { InterviewController } from "../controllers/interviewControllers";

const interviewRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Interview
 *   description: Interview Management APIs
 */


/**
 * @swagger
 * /interviews:
 *   post:
 *     summary: Schedule an interview
 *     tags: [Interview]
 *     description: Schedule interview for a candidate application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: integer
 *                 example: 3
 *               interviewDate:
 *                 type: string
 *                 example: 2026-03-20
 *               interviewer:
 *                 type: string
 *                 example: HR Manager
 *               location:
 *                 type: string
 *                 example: Online
 *     responses:
 *       201:
 *         description: Interview scheduled successfully
 */
interviewRoutes.post(
  "/",
  exceptionHandler(Validator.check(InterviewValidator)),
  exceptionHandler(InterviewController.scheduleInterview)
);


/**
 * @swagger
 * /interviews:
 *   get:
 *     summary: Get all interviews
 *     tags: [Interview]
 *     responses:
 *       200:
 *         description: List of interviews
 */
interviewRoutes.get("/", InterviewController.getAllInterviews);


/**
 * @swagger
 * /interviews/{id}:
 *   get:
 *     summary: Get interview details
 *     tags: [Interview]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview details
 */
interviewRoutes.get("/:id", InterviewController.getInterviewDetails);


/**
 * @swagger
 * /interviews/{id}:
 *   put:
 *     summary: Update interview details
 *     tags: [Interview]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interviewDate:
 *                 type: string
 *               interviewer:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview updated successfully
 */
interviewRoutes.put("/:id", InterviewController.updateInterview);


/**
 * @swagger
 * /interviews/{id}/status:
 *   patch:
 *     summary: Update interview status
 *     tags: [Interview]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Interview status updated
 */
interviewRoutes.patch("/:id/status", InterviewController.updateInterviewStatus);


/**
 * @swagger
 * /interviews/{id}/feedback:
 *   patch:
 *     summary: Add interview feedback
 *     tags: [Interview]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *                 example: Candidate performed well in technical round
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 */
interviewRoutes.patch("/:id/feedback", InterviewController.updateInterviewFeedback);

export default interviewRoutes;