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
const roleEnum_1 = require("../../enums/roleEnum");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    // Signup — auto-creates recruiter profile row if role is recruiter
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = req.body;
            try {
                const userExists = yield new services_1.UserServices().findone(email);
                if (userExists) {
                    return res.status(400).json({
                        success: false,
                        message: `User with email ${email} already exists!`
                    });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 12);
                const user = yield new services_1.UserServices().create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: roleEnum_1.RoleEnum.user // always 'user' on signup — admin assigns roles
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
                const user = yield new services_1.UserServices().findone(email);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User does not exist!"
                    });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials!"
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: (user.role || '').toLowerCase().trim() }, config_1.jwtSecret, { expiresIn: '24h' });
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
                return res.status(200).json({ success: true, message: "Logout successful!" });
            }
            catch (error) {
                console.error('Logout error:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.AuthController = AuthController;
