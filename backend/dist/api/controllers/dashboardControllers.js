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
exports.DashboardController = void 0;
const dashboardServices_1 = require("../../services/dashboardServices");
const models_1 = __importDefault(require("../../models"));
const svc = new dashboardServices_1.DashboardServices();
class DashboardController {
    // Admin: full system — all users, hired/rejected, interview schedules, recruiter list
    static getAdminStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield svc.getAdminStats();
                return res.status(200).json({ success: true, data });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Failed to fetch admin dashboard", error: error.message });
            }
        });
    }
    // Recruiter: own pipeline, job performance, upcoming interviews
    static getRecruiterStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield svc.getRecruiterStats(req.user.recruiterId);
                return res.status(200).json({ success: true, data });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Failed to fetch recruiter dashboard", error: error.message });
            }
        });
    }
    // User/Candidate: own applications, interview schedule, rejections, offers
    static getUserStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate) {
                    // Return empty dashboard — don't crash with 404
                    return res.status(200).json({
                        success: true,
                        data: {
                            overview: { totalApplications: 0, activeApplications: 0, upcomingInterviews: 0, totalHires: 0 },
                            applicationStatus: { applied: 0, underReview: 0, interview: 0, hired: 0, rejected: 0 },
                            recentApplications: [],
                            upcomingInterviews: [],
                            activityFeed: [],
                        }
                    });
                }
                const data = yield svc.getUserStats(candidate.id);
                return res.status(200).json({ success: true, data });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Failed to fetch user dashboard", error: error.message });
            }
        });
    }
}
exports.DashboardController = DashboardController;
