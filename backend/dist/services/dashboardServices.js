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
exports.DashboardServices = void 0;
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
class DashboardServices {
    // Get overall admin statistics
    getAdminStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield models_1.default.Users.count();
            const activeJobPositions = yield models_1.default.JobPositions.count({
                where: { status: 'open' }
            });
            const totalApplications = yield models_1.default.Applications.count();
            const upcomingInterviews = yield models_1.default.Interviews.count({
                where: { status: 'scheduled' }
            });
            const recentHires = yield models_1.default.Applications.count({
                where: {
                    status: 'hired',
                    createdAt: { [sequelize_1.Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            });
            return {
                totalUsers,
                activeJobPositions,
                totalApplications,
                upcomingInterviews,
                recentHires
            };
        });
    }
    // Get statistics for a specific user
    getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Total applications by user
            const myApplications = yield models_1.default.Applications.count({
                where: { candidateId: userId }
            });
            // Total upcoming interviews by user
            const myUpcomingInterviews = yield models_1.default.Interviews.count({
                where: { status: 'scheduled' },
                include: [{
                        model: models_1.default.Applications,
                        as: 'Application',
                        attributes: [],
                        where: { candidateId: userId }
                    }]
            });
            // Count applications by status
            const statusCounts = yield models_1.default.Applications.findAll({
                attributes: [
                    'status',
                    [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']
                ],
                where: { candidateId: userId },
                group: ['status']
            });
            // Define valid statuses and type for safety
            const validStatuses = ['APPLIED', 'UNDER_REVIEW', 'INTERVIEWED', 'HIRED', 'REJECTED'];
            // Initialize status map
            const applicationStatus = {
                APPLIED: 0,
                UNDER_REVIEW: 0,
                INTERVIEWED: 0,
                HIRED: 0,
                REJECTED: 0
            };
            // Populate counts safely
            statusCounts.forEach((row) => {
                const statusKey = row.status.toUpperCase();
                if (validStatuses.includes(statusKey)) {
                    applicationStatus[statusKey] = parseInt(row.get('count'));
                }
                else {
                    console.warn(`Unexpected status value: ${row.status}`);
                }
            });
            return {
                myApplications,
                myUpcomingInterviews,
                applicationStatus
            };
        });
    }
}
exports.DashboardServices = DashboardServices;
