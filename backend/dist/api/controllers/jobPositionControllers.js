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
exports.JobController = void 0;
const jobPositionServices_1 = require("../../services/jobPositionServices");
class JobController {
    // Public: browse all open jobs
    static getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, recruiterId } = req.query;
                const jobs = yield new jobPositionServices_1.JobServices().findAll({
                    status: status,
                    recruiterId: recruiterId ? Number(recruiterId) : undefined,
                });
                return res.status(200).json({ success: true, data: jobs });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static getJobById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const job = yield new jobPositionServices_1.JobServices().findById(Number(id));
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                return res.status(200).json({ success: true, data: job });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Recruiter: post a job — recruiterId from JWT
    static createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newJob = yield new jobPositionServices_1.JobServices().create(Object.assign(Object.assign({}, req.body), { recruiterId: req.user.recruiterId }));
                return res.status(201).json({ success: true, message: "Job posted successfully", data: newJob });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Recruiter (own jobs) / Admin: update
    static updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const job = yield new jobPositionServices_1.JobServices().findById(Number(id));
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                if (req.user.role !== 'admin' && job.recruiterId !== req.user.recruiterId) {
                    return res.status(403).json({ success: false, message: "Access denied. You can only update your own jobs." });
                }
                yield new jobPositionServices_1.JobServices().update(Number(id), req.body);
                return res.status(200).json({ success: true, message: "Job updated successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Recruiter (own jobs) / Admin: delete
    static deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const job = yield new jobPositionServices_1.JobServices().findById(Number(id));
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                if (req.user.role !== 'admin' && job.recruiterId !== req.user.recruiterId) {
                    return res.status(403).json({ success: false, message: "Access denied. You can only delete your own jobs." });
                }
                yield new jobPositionServices_1.JobServices().delete(Number(id));
                return res.status(200).json({ success: true, message: "Job deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Recruiter: view own posted jobs
    static getMyJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield new jobPositionServices_1.JobServices().findByRecruiterId(req.user.recruiterId);
                return res.status(200).json({ success: true, data: jobs });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.JobController = JobController;
