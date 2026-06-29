import { Request, Response } from "express";
import { UserServices } from "../../services";
import { jwtSecret } from "../../config";
import { RoleEnum } from "../../enums/roleEnum";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  // Signup — auto-creates recruiter profile row if role is recruiter
  public static async signup(req: Request, res: Response): Promise<Response> {
    const { firstName, lastName, email, password } = req.body;

    try {
      const userExists = await new UserServices().findone(email);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: `User with email ${email} already exists!`
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await new UserServices().create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: RoleEnum.user   // always 'user' on signup — admin assigns roles
      });

      // No separate recruiter table — role='recruiter' in Users is sufficient

      return res.status(201).json({
        success: true,
        message: 'Signup successful! You can proceed to login',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error('signup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Login
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await new UserServices().findone(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User does not exist!"
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials!"
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: (user.role || '').toLowerCase().trim() },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: {
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: (user.role || '').toLowerCase().trim()
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Logout
  public static async logout(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ success: true, message: "Logout successful!" });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
