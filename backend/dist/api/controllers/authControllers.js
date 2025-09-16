"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../../services");
const config_1 = require("../../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    // (Signup)
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, role } = req.body;
            try {
                // Check if user exists
                const userExists = yield new services_1.UserServices().findone(email);
                if (userExists) {
                    return res.status(400).json({
                        success: false,
                        message: `User with email ${email} already exists!`
                    });
                }
                // Hash password
                const hashedPassword = yield bcrypt_1.default.hash(password, 12);
                // Create user
                const user = yield new services_1.UserServices().create({
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
            }
            catch (error) {
                console.error('signup error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // Login
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Check if user exists
                const user = yield new services_1.UserServices().findone(email);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User does not exist!"
                    });
                }
                // Verify password
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials!"
                    });
                }
                // Generate JWT token 
                const token = jsonwebtoken_1.default.sign({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                }, config_1.jwtSecret, { expiresIn: '1h' });
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
            }
            catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // Logout 
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({
                    success: true,
                    message: "Logout successful!"
                });
            }
            catch (error) {
                console.error('Logout error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
