"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class Guard {
    // Verifies JWT and attaches decoded payload to req.user
    static grantAccess(req, res, next) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Please provide a token with your request headers" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.jwtSecret);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    }
    // Checks that the authenticated identity has one of the allowed roles
    static grantRole(...roles) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Authentication required" });
            }
            // Normalize both sides — handles "Admin", "ADMIN", "admin " etc.
            const userRole = (req.user.role || '').toLowerCase().trim();
            const allowedRoles = roles.map(r => r.toLowerCase().trim());
            if (allowedRoles.includes(userRole)) {
                next();
            }
            else {
                return res.status(403).json({ success: false, message: "You are not authorized to perform this task" });
            }
        };
    }
}
exports.Guard = Guard;
