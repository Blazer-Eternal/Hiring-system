import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { CustomRequestInterface } from "../interfaces";

export class Guard {
  // Verifies JWT and attaches decoded payload to req.user
  public static grantAccess(req: CustomRequestInterface, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Please provide a token with your request headers" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded as CustomRequestInterface["user"];
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  // Checks that the authenticated identity has one of the allowed roles
  public static grantRole(...roles: string[]) {
    return (req: CustomRequestInterface, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      // Normalize both sides — handles "Admin", "ADMIN", "admin " etc.
      const userRole = (req.user.role || '').toLowerCase().trim();
      const allowedRoles = roles.map(r => r.toLowerCase().trim());
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ success: false, message: "You are not authorized to perform this task" });
      }
    };
  }
}
