import { Request, Response } from "express";
import { UserServices } from "../../services";
import { jwtSecret } from "../../config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    // (Signup)
    public static async signup(req: Request, res: Response): Promise<Response> {
        const { name, email, password, role } = req.body;

        try {
            // Check if user exists
            const userExists = await new UserServices().findone(email);
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: `User with email ${email} already exists!`
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create user
            const user = await new UserServices().create({
                name,
                email,
                password: hashedPassword,
                role
            });

            return res.status(201).json({
                success: true,
                message: 'Signup successful! You can proceed to login',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
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
            // Check if user exists
            const user = await new UserServices().findone(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist!"
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials!"
                });
            }

            // Generate JWT token 
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                jwtSecret,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful!",
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
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
            
    
            return res.status(200).json({
                success: true,
                message: "Logout successful!"
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}