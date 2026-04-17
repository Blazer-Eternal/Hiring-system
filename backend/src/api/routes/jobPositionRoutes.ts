import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { jobPostionValidator } from "../../validators";
import { JobController } from "../controllers/jobPositionControllers";

const jobRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: JobPosition
 *   description: Job Position Management APIs
 */


/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job position
 *     tags: [JobPosition]
 *     description: HR creates a new job opening
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               description:
 *                 type: string
 *                 example: Responsible for backend development
 *               location:
 *                 type: string
 *                 example: Kathmandu
 *               salary:
 *                 type: number
 *                 example: 60000
 *     responses:
 *       201:
 *         description: Job created successfully
 */
jobRoutes.post(
  "/",
  exceptionHandler(Validator.check(jobPostionValidator)),
  exceptionHandler(JobController.createJob)
);


/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job positions
 *     tags: [JobPosition]
 *     responses:
 *       200:
 *         description: List of job positions
 */
jobRoutes.get("/", JobController.getAllJobs);


/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [JobPosition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job details
 */
jobRoutes.get("/:id", JobController.getJobById);


/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update job position
 *     tags: [JobPosition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
jobRoutes.put("/:id", JobController.updateJob);


/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete job position
 *     tags: [JobPosition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
jobRoutes.delete("/:id", JobController.deleteJob);

export default jobRoutes;