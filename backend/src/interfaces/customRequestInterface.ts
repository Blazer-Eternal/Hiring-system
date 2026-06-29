import { Request } from "express";

// Shape of the decoded JWT payload attached to every authenticated request.
// Users have userId; Recruiters have recruiterId.
export interface JwtPayload {
  userId?: number;       // set for users (role: user / admin)
  recruiterId?: number;  // set for recruiters (role: recruiter)
  email: string;
  role: string;
}

export interface CustomRequestInterface extends Request {
  user: JwtPayload;
}
