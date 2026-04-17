import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { ApplicationValidator } from "../../validators";
import { ApplicationController } from "../controllers/ApplicationControllers";

const applicationRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Job Application Management APIs
 */


/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a job application
 *     tags: [Application]
 *     description: Candidate applies for a job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateId:
 *                 type: integer
 *                 example: 1
 *               jobId:
 *                 type: integer
 *                 example: 5
 *               resume:
 *                 type: string
 *                 example: resume.pdf
 *               status:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Application created successfully
 */
applicationRoutes.post(
  "/",
  exceptionHandler(Validator.check(ApplicationValidator)),
  exceptionHandler(ApplicationController.createApplication)
);


/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Application]
 *     responses:
 *       200:
 *         description: List of applications
 */
applicationRoutes.get("/", ApplicationController.getAllApplications);


/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application details
 */
applicationRoutes.get("/:id", ApplicationController.getApplicationById);


/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update application
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateId:
 *                 type: integer
 *               jobId:
 *                 type: integer
 *               resume:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
 */
applicationRoutes.put(
  "/:id",
  exceptionHandler(Validator.check(ApplicationValidator)),
  exceptionHandler(ApplicationController.updateApplication)
);


/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
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
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
applicationRoutes.patch(
  "/:id/status",
  ApplicationController.updateApplicationStatus
);


/**
 * @swagger
 * /applications/jobs/{jobId}/applications:
 *   get:
 *     summary: Get applications by job
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Applications for a job
 */
applicationRoutes.get(
  "/jobs/:jobId/applications",
  ApplicationController.getApplicationsByJob
);


/**
 * @swagger
 * /applications/candidates/{candidateId}/applications:
 *   get:
 *     summary: Get applications by candidate
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Applications by candidate
 */
applicationRoutes.get(
  "/candidates/:candidateId/applications",
  ApplicationController.getApplicationsByCandidate
);


/**
 * @swagger
 * /applications/interviews/{interviewId}/applications:
 *   get:
 *     summary: Get applications by interview
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Applications related to interview
 */
applicationRoutes.get(
  "/interviews/:interviewId/applications",
  ApplicationController.getApplicationsByInterview
);

export default applicationRoutes;