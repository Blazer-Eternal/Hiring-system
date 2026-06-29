import { Router } from "express";
import { UserController } from "../controllers/userControllers";
import { exceptionHandler, Guard } from "../../middleware";
import { RoleEnum } from "../../enums/roleEnum";

const userRoutes = Router();

// Admin: view all users
userRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(UserController.getAllUsers)
);

// Admin: assign role to a user (e.g. promote to recruiter)
userRoutes.patch(
  "/:id/role",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(UserController.assignRole)
);

// Admin: delete a user
userRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(UserController.deleteUser)
);

export default userRoutes;
