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
exports.RecruiterServices = void 0;
const models_1 = __importDefault(require("../models"));
class RecruiterServices {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.create(data);
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.findOne({ where: { email } });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.findByPk(id);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified'],
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiter = yield models_1.default.Recruiters.findByPk(id);
            if (!recruiter)
                return null;
            return yield recruiter.update(data);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.default.Recruiters.destroy({ where: { id } });
        });
    }
    // Admin: approve a recruiter — sets isVerified = true
    static verify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiter = yield models_1.default.Recruiters.findByPk(id);
            if (!recruiter)
                return null;
            return yield recruiter.update({ isVerified: true });
        });
    }
    // Admin: get all pending (unverified) recruiters
    static getPending() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.findAll({
                where: { isVerified: false },
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified', 'createdAt'],
            });
        });
    }
    // Admin: get all verified recruiters
    static getVerified() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Recruiters.findAll({
                where: { isVerified: true },
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified', 'createdAt'],
            });
        });
    }
    // Applications for jobs posted by this recruiter
    static getApplicationsForRecruiter(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield models_1.default.JobPositions.findAll({ where: { recruiterId } });
            const jobIds = jobs.map((j) => j.id);
            if (jobIds.length === 0)
                return [];
            return yield models_1.default.Applications.findAll({
                where: { jobId: jobIds },
                include: [
                    {
                        model: models_1.default.Candidates,
                        as: 'Candidate',
                        attributes: ['id', 'name', 'email', 'phoneNumber', 'temporaryAddress', 'permanentAddress', 'cvUrl'],
                    },
                    {
                        model: models_1.default.JobPositions,
                        as: 'Job',
                        attributes: ['id', 'title', 'department', 'location', 'status'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        });
    }
    // Interviews scheduled by this recruiter
    static getInterviewsForRecruiter(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.Interviews.findAll({
                where: { recruiterId },
                include: [
                    {
                        model: models_1.default.Candidates,
                        as: 'Candidate',
                        attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'],
                    },
                    {
                        model: models_1.default.Applications,
                        as: 'Application',
                        attributes: ['id', 'status', 'createdAt'],
                        include: [
                            {
                                model: models_1.default.JobPositions,
                                as: 'Job',
                                attributes: ['id', 'title', 'department', 'location'],
                            },
                        ],
                    },
                ],
                order: [['scheduleDate', 'ASC']],
            });
        });
    }
}
exports.RecruiterServices = RecruiterServices;
