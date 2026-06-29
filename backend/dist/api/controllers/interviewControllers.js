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
exports.InterviewController = void 0;
const interviewServices_1 = require("../../services/interviewServices");
const interviewStatusEnum_1 = require("../../enums/interviewStatusEnum");
const enums_1 = require("../../enums");
const models_1 = __importDefault(require("../../models"));
class InterviewController {
    // Recruiter: schedule interview — recruiterId from JWT
    static scheduleInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId, scheduleDate, duration } = req.body;
                const application = yield models_1.default.Applications.findByPk(applicationId);
                if (!application)
                    return res.status(404).json({ success: false, message: "Application not found" });
                const job = yield models_1.default.JobPositions.findByPk(application.jobId);
                if (!job || job.recruiterId !== req.user.recruiterId) {
                    return res.status(403).json({ success: false, message: "Access denied. This application is not for your job." });
                }
                const candidateId = application.candidateId;
                const interview = yield new interviewServices_1.InterviewServices().create({
                    applicationId,
                    candidateId,
                    recruiterId: req.user.recruiterId,
                    scheduleDate,
                    duration,
                });
                yield models_1.default.Applications.update({ status: enums_1.ApplicationStatusEnum.INTERVIEW, interviewId: interview.id }, { where: { id: applicationId } });
                return res.status(201).json({ success: true, message: "Interview scheduled successfully", data: interview });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Admin: all; Recruiter: own; Candidate: own
    static getAllInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let interviews;
                if (req.user.role === 'admin') {
                    interviews = yield models_1.default.Interviews.findAll({
                        include: [
                            { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber'] },
                            { model: models_1.default.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
                            {
                                model: models_1.default.Applications, as: 'Application',
                                attributes: ['id', 'status'],
                                include: [{ model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department'] }],
                            },
                        ],
                        order: [['scheduleDate', 'ASC']],
                    });
                }
                else if (req.user.role === 'recruiter') {
                    interviews = yield models_1.default.Interviews.findAll({
                        where: { recruiterId: req.user.recruiterId },
                        include: [
                            { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                            {
                                model: models_1.default.Applications, as: 'Application',
                                attributes: ['id', 'status'],
                                include: [{ model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department'] }],
                            },
                        ],
                        order: [['scheduleDate', 'ASC']],
                    });
                }
                else {
                    const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                    if (!candidate)
                        return res.status(404).json({ success: false, message: "Candidate profile not found" });
                    interviews = yield models_1.default.Interviews.findAll({
                        where: { candidateId: candidate.id },
                        include: [
                            { model: models_1.default.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
                            {
                                model: models_1.default.Applications, as: 'Application',
                                attributes: ['id', 'status'],
                                include: [{ model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] }],
                            },
                        ],
                        order: [['scheduleDate', 'ASC']],
                    });
                }
                return res.status(200).json({ success: true, data: interviews });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static getInterviewDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const interview = yield models_1.default.Interviews.findByPk(Number(id), {
                    include: [
                        { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                        { model: models_1.default.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
                        {
                            model: models_1.default.Applications, as: 'Application',
                            attributes: ['id', 'status'],
                            include: [{ model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] }],
                        },
                    ],
                });
                if (!interview)
                    return res.status(404).json({ success: false, message: "Interview not found" });
                return res.status(200).json({ success: true, data: interview });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static updateInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (req.user.role === 'recruiter') {
                    const interview = yield models_1.default.Interviews.findByPk(Number(id));
                    if (!interview || interview.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                const isUpdated = yield new interviewServices_1.InterviewServices().update(Number(id), req.body);
                if (!isUpdated)
                    return res.status(404).json({ success: false, message: "Interview not found" });
                return res.status(200).json({ success: true, message: "Interview updated successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static updateInterviewStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            try {
                if (!Object.values(interviewStatusEnum_1.InterviewStatusEnum).includes(status)) {
                    return res.status(400).json({ success: false, message: "Invalid status value" });
                }
                if (req.user.role === 'recruiter') {
                    const interview = yield models_1.default.Interviews.findByPk(Number(id));
                    if (!interview || interview.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                const isUpdated = yield new interviewServices_1.InterviewServices().update(Number(id), { status });
                if (!isUpdated)
                    return res.status(404).json({ success: false, message: "Interview not found" });
                return res.status(200).json({ success: true, message: "Interview status updated successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static updateInterviewFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { feedback, rating } = req.body;
            try {
                if (!feedback)
                    return res.status(400).json({ success: false, message: "Feedback is required" });
                if (req.user.role === 'recruiter') {
                    const interview = yield models_1.default.Interviews.findByPk(Number(id));
                    if (!interview || interview.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                const isUpdated = yield new interviewServices_1.InterviewServices().updateFeedback(Number(id), feedback, rating);
                if (!isUpdated)
                    return res.status(404).json({ success: false, message: "Interview not found" });
                return res.status(200).json({ success: true, message: "Interview feedback updated successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.InterviewController = InterviewController;
