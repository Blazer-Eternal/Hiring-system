import { Router } from "express";
import express from "express";
import { exceptionHandler, Validator } from "../../middleware";
import { signupValidator, loginValidator } from "../../validators";
import { AuthController } from "../controllers/authControllers";

const authRoutes = Router();

authRoutes.post(
    '/signup',
    exceptionHandler(Validator.check(signupValidator)),
    exceptionHandler(AuthController.signup)
);

authRoutes.post(
    '/login',
    exceptionHandler(Validator.check(loginValidator)),
    exceptionHandler(AuthController.login)
);


authRoutes.post("/logout", AuthController.logout);

export default authRoutes;