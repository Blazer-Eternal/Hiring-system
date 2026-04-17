import { Router } from "express";
import { CandidateController } from "../controllers/candidateControllers";
import { CandidateValidator } from "../../validators";
import { exceptionHandler, Validator } from "../../middleware";

const candidateRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Candidate
 *   description: Candidate Management APIs
 */


/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidate]
 *     responses:
 *       200:
 *         description: List of candidates
 */
candidateRoutes.get("/", CandidateController.getAllCandidates);


/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidate details
 */
candidateRoutes.get("/:id", CandidateController.getCandidateById);


/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Create a candidate
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ram Sharma
 *               email:
 *                 type: string
 *                 example: ram@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9800000000
 *               address:
 *                 type: string
 *                 example: Butwal, Nepal
 *     responses:
 *       201:
 *         description: Candidate created successfully
 */
candidateRoutes.post(
  "/",
  exceptionHandler(Validator.check(CandidateValidator)),
  exceptionHandler(CandidateController.createCandidate)
);


/**
 * @swagger
 * /candidates/{id}:
 *   put:
 *     summary: Update candidate
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate updated successfully
 */
candidateRoutes.put(
  "/:id",
  exceptionHandler(Validator.check(CandidateValidator)),
  exceptionHandler(CandidateController.updateCandidate)
);


/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Delete candidate
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidate deleted successfully
 */
candidateRoutes.delete("/:id", CandidateController.deleteCandidate);

export default candidateRoutes;