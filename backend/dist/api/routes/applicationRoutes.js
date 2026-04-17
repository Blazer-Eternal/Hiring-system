"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const validators_1 = require("../../validators");
const ApplicationControllers_1 = require("../controllers/ApplicationControllers");
const applicationRoutes = (0, express_1.Router)();
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
applicationRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.ApplicationValidator)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.createApplication));
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
applicationRoutes.get("/", ApplicationControllers_1.ApplicationController.getAllApplications);
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
applicationRoutes.get("/:id", ApplicationControllers_1.ApplicationController.getApplicationById);
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
applicationRoutes.put("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.ApplicationValidator)), (0, middleware_1.exceptionHandler)(ApplicationControllers_1.ApplicationController.updateApplication));
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
applicationRoutes.patch("/:id/status", ApplicationControllers_1.ApplicationController.updateApplicationStatus);
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
applicationRoutes.get("/jobs/:jobId/applications", ApplicationControllers_1.ApplicationController.getApplicationsByJob);
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
applicationRoutes.get("/candidates/:candidateId/applications", ApplicationControllers_1.ApplicationController.getApplicationsByCandidate);
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
applicationRoutes.get("/interviews/:interviewId/applications", ApplicationControllers_1.ApplicationController.getApplicationsByInterview);
exports.default = applicationRoutes;
