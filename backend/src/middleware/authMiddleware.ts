// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { jwtSecret } from "../config";
// import { RoleEnum } from "../enums/roleEnum";

// // Extend Express Request type to include user property
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userId: number;
//         email: string;
//         role: RoleEnum;
//       };
//     }
//   }
// }

// export const AuthMiddleware = (requiredRoles?: RoleEnum[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // 1. Get token from header
//       const authHeader = req.headers.authorization;
//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication token missing or malformed"
//         });
//       }

//       const token = authHeader.split(" ")[1];

//       // 2. Verify token
//       const decoded = jwt.verify(token, jwtSecret) as {
//         userId: number;
//         email: string;
//         role: RoleEnum;
//       };

//       // 3. Check role permissions if specified
//       if (requiredRoles && !requiredRoles.includes(decoded.role)) {
//         return res.status(403).json({
//           success: false,
//           message: "Insufficient permissions"
//         });
//       }

//       // 4. Attach user to request
//       req.user = {
//         userId: decoded.userId,
//         email: decoded.email,
//         role: decoded.role
//       };

//       next();
//     } catch (error) {
//       console.error("Authentication error:", error);
      
//       if (error instanceof jwt.TokenExpiredError) {
//         return res.status(401).json({
//           success: false,
//           message: "Token expired"
//         });
//       }

//       if (error instanceof jwt.JsonWebTokenError) {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid token"
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: "Authentication failed"
//       });
//     }
//   };
// };