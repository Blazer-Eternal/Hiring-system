"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. No token provided.",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        if (!roles.includes(authReq.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
            });
        }
        next();
    };
};
exports.authorize = authorize;
