import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { signupValidator, loginValidator } from "../../validators";
import { AuthController } from "../controllers/authControllers";

const authRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: candidate
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
authRoutes.post(
  "/signup",
  exceptionHandler(Validator.check(signupValidator)),
  exceptionHandler(AuthController.signup)
);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Login using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post(
  "/login",
  exceptionHandler(Validator.check(loginValidator)),
  exceptionHandler(AuthController.login)
);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Logout current user session
 *     responses:
 *       200:
 *         description: Logout successful
 */
authRoutes.post(
  "/logout",
  exceptionHandler(AuthController.logout)
);

export default authRoutes;