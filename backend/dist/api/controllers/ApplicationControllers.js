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
exports.ApplicationController = void 0;
const applicationServices_1 = require("../../services/applicationServices");
const enums_1 = require("../../enums");
const models_1 = __importDefault(require("../../models"));
// Algorithms — pure math (Bloom Filter O(1), LSH O(n), TF-IDF O(n×m))
const algorithms_1 = require("../algorithms");
// AI Features — smart notifications, resume parsing
const ai_1 = require("../ai");
// ── Build rich candidate text from all profile fields ─────────────────────────
// IMPORTANT: Do NOT include address fields — they add location noise (tilottama, kathmandu)
// that pollutes the match score with irrelevant words.
// Only include actual CV/skill content.
function buildRichCandidateText(candidate, cvText) {
    const parts = [];
    // CV text from request body — highest priority, most relevant
    if (cvText === null || cvText === void 0 ? void 0 : cvText.trim())
        parts.push(cvText.trim());
    // Only include name — NOT address fields (they add location noise)
    if (candidate.name && !(cvText === null || cvText === void 0 ? void 0 : cvText.trim()))
        parts.push(candidate.name);
    return parts.join(' ').trim();
}
// ─────────────────────────────────────────────────────────────────────────────
class ApplicationController {
    // ── User: apply for a job ─────────────────────────────────────────────────
    // 1. Bloom Filter O(1) fast duplicate check
    // 2. TF-IDF word matching between CV text and job description
    // 3. Store matchScore + matchedKeywords on the application
    // 4. Register in LSH index for near-duplicate detection
    // 5. Smart notifications
    static createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate) {
                    return res.status(403).json({ success: false, message: "Candidate profile not found. Please create your profile first." });
                }
                const { jobId, cvText } = req.body;
                const job = yield models_1.default.JobPositions.findByPk(jobId);
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                if (job.status !== 'open') {
                    return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
                }
                // ── Tier 1: Bloom Filter O(1) fast duplicate rejection ────────────────
                if ((0, algorithms_1.mightBeDuplicate)(candidate.id, jobId)) {
                    const existing = yield models_1.default.Applications.findOne({ where: { candidateId: candidate.id, jobId } });
                    if (existing) {
                        return res.status(409).json({ success: false, message: "You have already applied for this job" });
                    }
                }
                // ── CV Word Matching (TF-IDF + Keyword Matching) ─────────────────────
                // Build rich candidate text from all available profile fields + cvText
                const candidateCvText = buildRichCandidateText(candidate, cvText);
                const jobText = [
                    job.title,
                    job.description,
                    job.requirements,
                    job.department,
                    job.location,
                ].filter(Boolean).join(' ');
                const matchResult = (0, algorithms_1.computeMatch)(candidateCvText, jobText);
                const { matchScore, matchedKeywords } = matchResult;
                // ── Create Application with match data ────────────────────────────────
                const newApplication = yield new applicationServices_1.ApplicationServices().create({
                    candidateId: candidate.id,
                    jobId,
                    matchScore,
                    matchedKeywords,
                    cvSnapshot: candidateCvText,
                });
                // ── Register in Bloom Filter + LSH index ──────────────────────────────
                (0, algorithms_1.registerApplication)(candidate.id, jobId);
                algorithms_1.applicationLSHIndex.add({
                    id: `application:${newApplication.id}`,
                    text: candidateCvText,
                });
                // ── Smart Notifications ───────────────────────────────────────────────
                const recruiterUser = yield models_1.default.Users.findByPk(job.recruiterId, { attributes: ['firstName', 'lastName'] });
                const notifications = (0, ai_1.notifyApplicationReceived)({
                    candidateName: candidate.name,
                    jobTitle: job.title,
                    recruiterName: recruiterUser
                        ? `${recruiterUser.firstName} ${recruiterUser.lastName}`.trim()
                        : 'Recruiter',
                });
                return res.status(201).json({
                    success: true,
                    message: "Application submitted successfully",
                    data: {
                        id: newApplication.id,
                        candidateId: newApplication.candidateId,
                        jobId: newApplication.jobId,
                        status: newApplication.status,
                        matchScore,
                        matchedKeywords,
                        matchBreakdown: matchResult.breakdown,
                        matchSummary: matchScore >= 70
                            ? 'Strong match — your profile aligns well with this job'
                            : matchScore >= 40
                                ? 'Moderate match — consider highlighting relevant experience'
                                : matchScore > 0
                                    ? 'Low match — add more relevant skills to your profile or paste your CV text when applying'
                                    : 'No CV text provided — paste your CV text when applying to get a match score',
                    },
                    notifications,
                });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Admin: all; Recruiter: their jobs; User: own ──────────────────────────
    static getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let applications;
                if (req.user.role === 'admin') {
                    applications = yield models_1.default.Applications.findAll({
                        include: [
                            { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                            { model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location', 'status'] },
                        ],
                        order: [['createdAt', 'DESC']],
                    });
                }
                else if (req.user.role === 'recruiter') {
                    const jobs = yield models_1.default.JobPositions.findAll({ where: { recruiterId: req.user.recruiterId } });
                    const jobIds = jobs.map((j) => j.id);
                    applications = jobIds.length > 0
                        ? yield models_1.default.Applications.findAll({
                            where: { jobId: jobIds },
                            include: [
                                { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                                { model: models_1.default.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] },
                            ],
                            order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
                        })
                        : [];
                }
                else {
                    const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                    if (!candidate)
                        return res.status(200).json({ success: true, data: [] });
                    applications = yield models_1.default.Applications.findAll({
                        where: { candidateId: candidate.id },
                        include: [
                            {
                                model: models_1.default.JobPositions, as: 'Job',
                                attributes: ['id', 'title', 'department', 'location', 'salaryRange'],
                                include: [{ model: models_1.default.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }],
                            },
                        ],
                        order: [['updatedAt', 'DESC']],
                    });
                }
                return res.status(200).json({ success: true, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Get single application with match data ────────────────────────────────
    static getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const application = yield models_1.default.Applications.findByPk(Number(id), {
                    include: [
                        { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                        { model: models_1.default.JobPositions, as: 'Job' },
                    ],
                });
                if (!application)
                    return res.status(404).json({ success: false, message: "Application not found" });
                if (req.user.role === 'user') {
                    const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                    if (!candidate || application.candidateId !== candidate.id) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                else if (req.user.role === 'recruiter') {
                    const job = yield models_1.default.JobPositions.findByPk(application.jobId);
                    if (!job || job.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                return res.status(200).json({ success: true, data: application });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Recruiter/Admin: update application status ────────────────────────────
    static updateApplicationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { id } = req.params;
            const { status } = req.body;
            try {
                if (!Object.values(enums_1.ApplicationStatusEnum).includes(status)) {
                    return res.status(400).json({ success: false, message: "Invalid status value" });
                }
                const application = yield models_1.default.Applications.findByPk(Number(id));
                if (!application)
                    return res.status(404).json({ success: false, message: "Application not found" });
                if (req.user.role === 'recruiter') {
                    const job = yield models_1.default.JobPositions.findByPk(application.jobId);
                    if (!job || job.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied. You can only manage applications for your own jobs." });
                    }
                }
                yield new applicationServices_1.ApplicationServices().update(Number(id), { status });
                const appWithJob = yield models_1.default.Applications.findByPk(Number(id), {
                    include: [
                        { model: models_1.default.Candidates, as: 'Candidate', attributes: ['name'] },
                        { model: models_1.default.JobPositions, as: 'Job', attributes: ['title'] },
                    ],
                });
                const notification = (0, ai_1.notifyStatusChanged)({
                    candidateName: (_b = (_a = appWithJob === null || appWithJob === void 0 ? void 0 : appWithJob.Candidate) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Candidate',
                    jobTitle: (_d = (_c = appWithJob === null || appWithJob === void 0 ? void 0 : appWithJob.Job) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : 'the job',
                    newStatus: status,
                });
                return res.status(200).json({ success: true, message: "Application status updated successfully", notification });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Recruiter: rank candidates for a job by CV match score ────────────────
    // Uses TF-IDF to rank all applicants by how well their CV matches the job
    static getRankedCandidatesForJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jobId } = req.params;
            try {
                const job = yield models_1.default.JobPositions.findByPk(Number(jobId));
                if (!job)
                    return res.status(404).json({ success: false, message: "Job not found" });
                if (req.user.role === 'recruiter' && job.recruiterId !== req.user.recruiterId) {
                    return res.status(403).json({ success: false, message: "Access denied" });
                }
                const applications = yield models_1.default.Applications.findAll({
                    where: { jobId: Number(jobId) },
                    include: [{ model: models_1.default.Candidates, as: 'Candidate' }],
                    order: [['matchScore', 'DESC']],
                });
                const jobText = `${job.title} ${job.description} ${job.requirements} ${job.department}`;
                const ranked = applications.map((app) => {
                    var _a, _b, _c, _d, _e, _f;
                    // Use stored cvSnapshot first, then fall back to candidate profile fields
                    const cvText = ((_a = app.cvSnapshot) === null || _a === void 0 ? void 0 : _a.trim())
                        || buildRichCandidateText(app.Candidate);
                    const matchResult = app.matchScore !== null && app.matchScore > 0
                        ? { matchScore: app.matchScore, matchedKeywords: (_b = app.matchedKeywords) !== null && _b !== void 0 ? _b : [], breakdown: null }
                        : (0, algorithms_1.computeMatch)(cvText, jobText);
                    return {
                        applicationId: app.id,
                        candidateId: (_c = app.Candidate) === null || _c === void 0 ? void 0 : _c.id,
                        candidateName: (_d = app.Candidate) === null || _d === void 0 ? void 0 : _d.name,
                        candidateEmail: (_e = app.Candidate) === null || _e === void 0 ? void 0 : _e.email,
                        cvUrl: (_f = app.Candidate) === null || _f === void 0 ? void 0 : _f.cvUrl,
                        applicationStatus: app.status,
                        matchScore: matchResult.matchScore,
                        matchedKeywords: matchResult.matchedKeywords,
                        matchSummary: matchResult.matchScore >= 70 ? 'Strong match'
                            : matchResult.matchScore >= 40 ? 'Moderate match'
                                : 'Low match',
                        appliedAt: app.createdAt,
                    };
                }).sort((a, b) => b.matchScore - a.matchScore);
                return res.status(200).json({ success: true, data: ranked });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── User: view own applications with match scores ─────────────────────────
    static getMyApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({ where: { userId: req.user.userId } });
                if (!candidate)
                    return res.status(200).json({ success: true, data: [] });
                const applications = yield models_1.default.Applications.findAll({
                    where: { candidateId: candidate.id },
                    include: [
                        {
                            model: models_1.default.JobPositions, as: 'Job',
                            attributes: ['id', 'title', 'department', 'location', 'salaryRange', 'status'],
                            include: [{ model: models_1.default.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }],
                        },
                    ],
                    order: [['updatedAt', 'DESC']],
                });
                return res.status(200).json({ success: true, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // ── Recruiter/Admin: applications by job ─────────────────────────────────
    static getApplicationsByJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jobId } = req.params;
            try {
                if (req.user.role === 'recruiter') {
                    const job = yield models_1.default.JobPositions.findByPk(Number(jobId));
                    if (!job || job.recruiterId !== req.user.recruiterId) {
                        return res.status(403).json({ success: false, message: "Access denied" });
                    }
                }
                const applications = yield models_1.default.Applications.findAll({
                    where: { jobId: Number(jobId) },
                    include: [
                        { model: models_1.default.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                    ],
                    order: [['matchScore', 'DESC']],
                });
                return res.status(200).json({ success: true, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static getApplicationsByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidateId } = req.params;
            try {
                const applications = yield new applicationServices_1.ApplicationServices().findByCandidateId(Number(candidateId));
                return res.status(200).json({ success: true, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static getApplicationsByInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { interviewId } = req.params;
            try {
                const applications = yield new applicationServices_1.ApplicationServices().findbyInterviewId(Number(interviewId));
                return res.status(200).json({ success: true, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
