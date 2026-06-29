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
exports.RecruiterAuthController = void 0;
const recruiterServices_1 = require("../../services/recruiterServices");
const config_1 = require("../../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class RecruiterAuthController {
    // Recruiter signup — isVerified defaults to false, admin must approve before login works
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, phoneNumber, location } = req.body;
            try {
                const existing = yield recruiterServices_1.RecruiterServices.findByEmail(email);
                if (existing) {
                    return res.status(400).json({
                        success: false,
                        message: `A recruiter account with email ${email} already exists.`
                    });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 12);
                const recruiter = yield recruiterServices_1.RecruiterServices.create({
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
            }
            catch (error) {
                console.error('Recruiter signup error:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    // Recruiter login — blocked if not yet verified by admin
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.findByEmail(email);
                if (!recruiter) {
                    return res.status(404).json({ success: false, message: "Recruiter account does not exist." });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, recruiter.password);
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
                const token = jsonwebtoken_1.default.sign({ recruiterId: recruiter.id, email: recruiter.email, role: 'recruiter' }, config_1.jwtSecret, { expiresIn: '1h' });
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
            }
            catch (error) {
                console.error('Recruiter login error:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ success: true, message: "Logout successful!" });
        });
    }
}
exports.RecruiterAuthController = RecruiterAuthController;
