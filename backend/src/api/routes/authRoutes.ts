import { Router } from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { signupValidator, loginValidator } from "../../validators";
import { recruiterSignupValidator, recruiterLoginValidator } from "../../validators/recruiterValidator";
import { AuthController } from "../controllers/authControllers";
import { RecruiterAuthController } from "../controllers/recruiterAuthControllers";

const authRoutes = Router();

// ── User auth ─────────────────────────────────────────────────────────────────
authRoutes.post("/signup",  exceptionHandler(Validator.check(signupValidator)),  exceptionHandler(AuthController.signup));
authRoutes.post("/login",   exceptionHandler(Validator.check(loginValidator)),   exceptionHandler(AuthController.login));
authRoutes.post("/logout",  exceptionHandler(AuthController.logout));

// ── Recruiter auth (separate table, separate credentials) ─────────────────────
authRoutes.post("/recruiter/signup", exceptionHandler(Validator.check(recruiterSignupValidator)), exceptionHandler(RecruiterAuthController.signup));
authRoutes.post("/recruiter/login",  exceptionHandler(Validator.check(recruiterLoginValidator)),  exceptionHandler(RecruiterAuthController.login));
authRoutes.post("/recruiter/logout", exceptionHandler(RecruiterAuthController.logout));

export default authRoutes;
