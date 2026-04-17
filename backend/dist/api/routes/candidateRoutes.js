"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateControllers_1 = require("../controllers/candidateControllers");
const validators_1 = require("../../validators");
const middleware_1 = require("../../middleware");
const candidateRoutes = (0, express_1.Router)();
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
candidateRoutes.get("/", candidateControllers_1.CandidateController.getAllCandidates);
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
candidateRoutes.get("/:id", candidateControllers_1.CandidateController.getCandidateById);
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
candidateRoutes.post("/", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.CandidateValidator)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.createCandidate));
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
candidateRoutes.put("/:id", (0, middleware_1.exceptionHandler)(middleware_1.Validator.check(validators_1.CandidateValidator)), (0, middleware_1.exceptionHandler)(candidateControllers_1.CandidateController.updateCandidate));
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
candidateRoutes.delete("/:id", candidateControllers_1.CandidateController.deleteCandidate);
exports.default = candidateRoutes;
