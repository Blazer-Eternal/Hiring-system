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
exports.AIController = void 0;
const models_1 = __importDefault(require("../../models"));
// Algorithms — pure math/data-structures (inside src/api/algorithms)
const algorithms_1 = require("../algorithms");
// AI Features — business-domain AI (inside src/api/ai)
const ai_1 = require("../ai");
class AIController {
    // ── Chatbot ─────────────────────────────────────────────────────────────────
    /** POST /api/v1/ai/chat — any authenticated user */
    static chat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question } = req.body;
                if (!question || typeof question !== 'string') {
                    return res.status(400).json({ success: false, message: "question is required" });
                }
                const response = (0, ai_1.askChatbot)(question.trim());
                return res.status(200).json({ success: true, data: response });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    /** GET /api/v1/ai/chat/faq — public */
    static getFAQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = (0, ai_1.getFAQCategories)();
                return res.status(200).json({ success: true, data: categories });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Resume Parser ───────────────────────────────────────────────────────────
    /** POST /api/v1/ai/resume/parse — user only */
    static parseResume(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rawText } = req.body;
                if (!rawText || typeof rawText !== 'string') {
                    return res.status(400).json({ success: false, message: "rawText is required" });
                }
                const parsed = (0, ai_1.parseResume)(rawText);
                return res.status(200).json({ success: true, data: parsed });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Job Matching — TF-IDF + Cosine Similarity O(n x m) ─────────────────────
    /** GET /api/v1/ai/jobs/match — user: ranked open jobs for their profile */
    static matchJobsForCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate) {
                    return res.status(404).json({ success: false, message: "Candidate profile not found" });
                }
                const jobs = yield models_1.default.JobPositions.findAll({ where: { status: 'open' } });
                if (jobs.length === 0)
                    return res.status(200).json({ success: true, data: [] });
                const profileText = (0, ai_1.buildCandidateProfileText)({
                    name: candidate.name,
                    temporaryAddress: candidate.temporaryAddress,
                    permanentAddress: candidate.permanentAddress,
                });
                const ranked = (0, algorithms_1.rankJobsForCandidate)(profileText, jobs.map((j) => ({
                    id: j.id,
                    title: j.title,
                    description: j.description,
                    requirements: j.requirements,
                })));
                (0, ai_1.updatePreferences)(candidate.id, { viewedJobIds: ranked.slice(0, 5).map(r => r.jobId) });
                return res.status(200).json({ success: true, data: ranked });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    /** GET /api/v1/ai/jobs/:jobId/candidates — recruiter: ranked candidates for a job */
    static matchCandidatesForJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const job = yield models_1.default.JobPositions.findByPk(Number(jobId));
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                if (job.recruiterId !== req.user.recruiterId) {
                    return res.status(403).json({ success: false, message: "Access denied" });
                }
                const applications = yield models_1.default.Applications.findAll({
                    where: { jobId: Number(jobId) },
                    include: [{ model: models_1.default.Candidates, as: 'Candidate' }],
                });
                const candidates = applications.map((app) => ({
                    id: app.Candidate.id,
                    name: app.Candidate.name,
                    email: app.Candidate.email,
                    cvUrl: app.Candidate.cvUrl,
                    profileText: (0, ai_1.buildCandidateProfileText)({
                        name: app.Candidate.name,
                        temporaryAddress: app.Candidate.temporaryAddress,
                        permanentAddress: app.Candidate.permanentAddress,
                    }),
                }));
                const ranked = (0, algorithms_1.rankCandidatesForJob)({
                    description: job.description,
                    requirements: job.requirements,
                    title: job.title,
                }, candidates);
                return res.status(200).json({ success: true, data: ranked });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Personalization ─────────────────────────────────────────────────────────
    /** GET /api/v1/ai/recommendations — user: personalized job recommendations */
    static getRecommendations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate) {
                    return res.status(404).json({ success: false, message: "Candidate profile not found" });
                }
                const jobs = yield models_1.default.JobPositions.findAll({ where: { status: 'open' } });
                const recommendations = (0, ai_1.getPersonalizedRecommendations)({
                    id: candidate.id,
                    name: candidate.name,
                    temporaryAddress: candidate.temporaryAddress,
                    permanentAddress: candidate.permanentAddress,
                }, jobs.map((j) => ({
                    id: j.id,
                    title: j.title,
                    description: j.description,
                    requirements: j.requirements,
                    department: j.department,
                    location: j.location,
                    status: j.status,
                })));
                return res.status(200).json({ success: true, data: recommendations });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    /** GET /api/v1/ai/profile/completeness — user: profile completeness check */
    static getProfileCompleteness(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate) {
                    return res.status(404).json({ success: false, message: "Candidate profile not found" });
                }
                const result = (0, ai_1.checkProfileCompleteness)({
                    name: candidate.name,
                    email: candidate.email,
                    phoneNumber: candidate.phoneNumber,
                    temporaryAddress: candidate.temporaryAddress,
                    permanentAddress: candidate.permanentAddress,
                    cvUrl: candidate.cvUrl,
                });
                return res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Duplicate Detection — LSH O(n) ─────────────────────────────────────────
    /** POST /api/v1/ai/applications/duplicates — admin: find near-duplicate applications */
    static findDuplicateApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text } = req.body;
                if (!text)
                    return res.status(400).json({ success: false, message: "text is required" });
                const duplicates = algorithms_1.applicationLSHIndex.findNearDuplicates({ id: 'query', text });
                return res.status(200).json({ success: true, data: duplicates });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.AIController = AIController;
