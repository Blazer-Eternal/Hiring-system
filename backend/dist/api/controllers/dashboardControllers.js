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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardServices_1 = require("../../services/dashboardServices");
const dashboardServices = new dashboardServices_1.DashboardServices();
class DashboardController {
    // Admin dashboard stats
    getAdminStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield dashboardServices.getAdminStats();
                return res.status(200).json({
                    success: true,
                    message: "Admin dashboard stats fetched successfully",
                    data
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch admin dashboard stats",
                    error: error.message
                });
            }
        });
    }
    // User dashboard stats
    getUserStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId); // assuming userId is passed as param
                if (isNaN(userId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid userId"
                    });
                }
                const data = yield dashboardServices.getUserStats(userId);
                return res.status(200).json({
                    success: true,
                    message: "User dashboard stats fetched successfully",
                    data
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch user dashboard stats",
                    error: error.message
                });
            }
        });
    }
}
exports.DashboardController = DashboardController;
