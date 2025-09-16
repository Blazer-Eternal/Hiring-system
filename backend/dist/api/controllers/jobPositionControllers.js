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
    static getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield new jobPositionServices_1.JobServices().findAll();
                return res.status(200).json({
                    success: true,
                    data: jobs,
                });
            }
            catch (error) {
                console.error('Error fetching jobs:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static getJobById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const job = yield new jobPositionServices_1.JobServices().findById(Number(id));
                if (!job) {
                    return res.status(404).json({
                        success: false,
                        message: 'Job not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: job,
                });
            }
            catch (error) {
                console.error('Error fetching job:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobData = req.body;
            try {
                const newJob = yield new jobPositionServices_1.JobServices().create(jobData);
                return res.status(201).json({
                    success: true,
                    message: 'Job created successfully',
                    data: newJob,
                });
            }
            catch (error) {
                console.error('Error creating job:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const isUpdated = yield new jobPositionServices_1.JobServices().update(Number(id), updateData);
                if (!isUpdated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Job not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Job updated successfully',
                });
            }
            catch (error) {
                console.error('Error updating job:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const isDeleted = yield new jobPositionServices_1.JobServices().delete(Number(id));
                if (!isDeleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Job not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Job deleted successfully',
                });
            }
            catch (error) {
                console.error('Error deleting job:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
}
exports.JobController = JobController;
