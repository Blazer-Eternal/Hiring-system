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
exports.ApplicationController = void 0;
const applicationServices_1 = require("../../services/applicationServices");
const enums_1 = require("../../enums");
class ApplicationController {
    static createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationData = req.body;
            try {
                const newApplication = yield new applicationServices_1.ApplicationServices().create(applicationData);
                return res.status(201).json({
                    success: true,
                    message: "Application submitted successfully",
                    data: newApplication,
                });
            }
            catch (error) {
                console.error("Error creating application:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const applications = yield new applicationServices_1.ApplicationServices().findAll(filters);
                return res.status(200).json({
                    success: true,
                    data: applications,
                });
            }
            catch (error) {
                console.error("Error fetching applications:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const application = yield new applicationServices_1.ApplicationServices().findById(Number(id));
                if (!application) {
                    return res.status(404).json({
                        success: false,
                        message: "Application not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: application,
                });
            }
            catch (error) {
                console.error("Error fetching application:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static updateApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const isUpdated = yield new applicationServices_1.ApplicationServices().update(Number(id), updateData);
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: "Application not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Application updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating application:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static updateApplicationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            try {
                if (!Object.values(enums_1.ApplicationStatusEnum).includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid status value",
                    });
                }
                const isUpdated = yield new applicationServices_1.ApplicationServices().update(Number(id), { status });
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: "Application not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Application status updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating application status:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static getApplicationsByJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const applications = yield new applicationServices_1.ApplicationServices().findByJobId(Number(id));
                return res.status(200).json({
                    success: true,
                    data: applications,
                });
            }
            catch (error) {
                console.error("Error fetching applications by job:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static getApplicationsByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const applications = yield new applicationServices_1.ApplicationServices().findByCandidateId(Number(id));
                return res.status(200).json({
                    success: true,
                    data: applications,
                });
            }
            catch (error) {
                console.error("Error fetching applications by candidate:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    static getApplicationsByInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const applications = yield new applicationServices_1.ApplicationServices().findbyInterviewId(Number(id));
                return res.status(200).json({
                    success: true,
                    data: applications,
                });
            }
            catch (error) {
                console.error("Error fetching applications by interview:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
