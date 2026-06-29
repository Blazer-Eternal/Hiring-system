import { Request, Response } from "express";
import { RecruiterServices } from "../../services/recruiterServices";
import { jwtSecret } from "../../config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class RecruiterAuthController {
  // Recruiter signup — isVerified defaults to false, admin must approve before login works
  static async signup(req: Request, res: Response): Promise<Response> {
    const { firstName, lastName, email, password, phoneNumber, location } = req.body;
    try {
      const existing = await RecruiterServices.findByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `A recruiter account with email ${email} already exists.`
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const recruiter = await RecruiterServices.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        location,
        isVerified: false,
      });

      return res.status(201).json({
        success: true,
        message: 'Your details are being verified. Please hold on while the admin reviews your credentials. You will be able to login once approved.',
        data: {
          id: recruiter.id,
          firstName: recruiter.firstName,
          lastName: recruiter.lastName,
          email: recruiter.email,
          phoneNumber: recruiter.phoneNumber,
          location: recruiter.location,
          isVerified: false,
        },
      });
    } catch (error) {
      console.error('Recruiter signup error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Recruiter login — blocked if not yet verified by admin
  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const recruiter = await RecruiterServices.findByEmail(email);
      if (!recruiter) {
        return res.status(404).json({ success: false, message: "Recruiter account does not exist." });
      }

      const isPasswordValid = await bcrypt.compare(password, recruiter.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
      }

      // Block login if admin has not verified yet
      if (!recruiter.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Your credentials are still being verified by the admin. Please wait for approval before logging in.",
          isVerified: false,
        });
      }

      const token = jwt.sign(
        { recruiterId: recruiter.id, email: recruiter.email, role: 'recruiter' },
        jwtSecret,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: {
          token,
          recruiter: {
            id: recruiter.id,
            firstName: recruiter.firstName,
            lastName: recruiter.lastName,
            email: recruiter.email,
            phoneNumber: recruiter.phoneNumber,
            location: recruiter.location,
          },
        },
      });
    } catch (error) {
      console.error('Recruiter login error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ success: true, message: "Logout successful!" });
  }
}
