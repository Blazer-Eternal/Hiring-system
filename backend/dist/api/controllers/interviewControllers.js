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
exports.InterviewController = void 0;
const interviewServices_1 = require("../../services/interviewServices");
const interviewStatusEnum_1 = require("../../enums/interviewStatusEnum");
class InterviewController {
    // Schedule new interview (CREATE)
    static scheduleInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const interview = yield new interviewServices_1.InterviewServices().create(req.body);
                return res.status(201).json({
                    success: true,
                    message: "Interview scheduled successfully",
                    data: interview,
                });
            }
            catch (error) {
                console.error("Error scheduling interview:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // List all interviews (READ)
    static getAllInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const interviews = yield new interviewServices_1.InterviewServices().findAll();
                return res.status(200).json({
                    success: true,
                    data: interviews,
                });
            }
            catch (error) {
                console.error("Error fetching interviews:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Get interview details (READ)
    static getInterviewDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const interview = yield new interviewServices_1.InterviewServices().findById(Number(id));
                if (!interview) {
                    return res.status(404).json({
                        success: false,
                        message: "Interview not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: interview,
                });
            }
            catch (error) {
                console.error("Error fetching interview:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Update interview schedule (UPDATE)
    static updateInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const isUpdated = yield new interviewServices_1.InterviewServices().update(Number(id), req.body);
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: "Interview not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Interview updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating interview:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Update interview status (UPDATE)
    static updateInterviewStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            try {
                if (!Object.values(interviewStatusEnum_1.InterviewStatusEnum).includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid status value",
                    });
                }
                const isUpdated = yield new interviewServices_1.InterviewServices().update(Number(id), status);
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: "Interview not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Interview status updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating interview status:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Add interview feedback (UPDATE)
    static updateInterviewFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { feedback, rating } = req.body;
            try {
                if (!feedback) {
                    return res.status(400).json({
                        success: false,
                        message: "Feedback is required",
                    });
                }
                const isUpdated = yield new interviewServices_1.InterviewServices().updateFeedback(Number(id), feedback, rating);
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: "Interview not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Interview feedback updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating interview feedback:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.InterviewController = InterviewController;
