"use strict";
/**
 * Basic Personalization Engine
 * Tracks candidate behavior and generates personalized job recommendations
 * Uses TF-IDF cosine similarity under the hood
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferences = updatePreferences;
exports.getPersonalizedRecommendations = getPersonalizedRecommendations;
exports.checkProfileCompleteness = checkProfileCompleteness;
const node_cache_1 = __importDefault(require("node-cache"));
const algorithms_1 = require("../algorithms");
const resumeParser_1 = require("./resumeParser");
// Cache recommendations for 10 minutes to avoid recomputing on every request
const recommendationCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 120 });
// In-memory preference store (would be persisted to DB in production)
const preferenceStore = new Map();
function updatePreferences(candidateId, update) {
    var _a;
    const existing = (_a = preferenceStore.get(candidateId)) !== null && _a !== void 0 ? _a : {
        candidateId,
        viewedJobIds: [],
        appliedJobIds: [],
        preferredLocations: [],
        preferredDepartments: [],
        lastActive: new Date(),
    };
    if (update.viewedJobIds) {
        existing.viewedJobIds = [...new Set([...existing.viewedJobIds, ...update.viewedJobIds])];
    }
    if (update.appliedJobIds) {
        existing.appliedJobIds = [...new Set([...existing.appliedJobIds, ...update.appliedJobIds])];
    }
    if (update.preferredLocations) {
        existing.preferredLocations = [...new Set([...existing.preferredLocations, ...update.preferredLocations])];
    }
    if (update.preferredDepartments) {
        existing.preferredDepartments = [...new Set([...existing.preferredDepartments, ...update.preferredDepartments])];
    }
    existing.lastActive = new Date();
    preferenceStore.set(candidateId, existing);
    // Invalidate cache when preferences change
    recommendationCache.del(`rec:${candidateId}`);
}
function getPersonalizedRecommendations(candidate, jobs, limit = 5) {
    var _a, _b;
    const cacheKey = `rec:${candidate.id}`;
    const cached = recommendationCache.get(cacheKey);
    if (cached)
        return cached;
    const prefs = preferenceStore.get(candidate.id);
    const appliedIds = new Set((_a = prefs === null || prefs === void 0 ? void 0 : prefs.appliedJobIds) !== null && _a !== void 0 ? _a : []);
    const viewedIds = new Set((_b = prefs === null || prefs === void 0 ? void 0 : prefs.viewedJobIds) !== null && _b !== void 0 ? _b : []);
    // Only recommend open jobs the candidate hasn't applied to
    const eligibleJobs = jobs.filter(j => j.status === 'open' && !appliedIds.has(j.id));
    if (eligibleJobs.length === 0)
        return [];
    const profileText = (0, resumeParser_1.buildCandidateProfileText)({
        name: candidate.name,
        temporaryAddress: candidate.temporaryAddress,
        permanentAddress: candidate.permanentAddress,
        cvText: candidate.cvText,
    });
    const ranked = (0, algorithms_1.rankJobsForCandidate)(profileText, eligibleJobs);
    // Apply preference boosts
    const boosted = ranked.map(r => {
        const job = eligibleJobs.find(j => j.id === r.jobId);
        let boost = 0;
        let reason = `${r.score}% profile match`;
        if (prefs === null || prefs === void 0 ? void 0 : prefs.preferredLocations.some(l => job.location.toLowerCase().includes(l.toLowerCase()))) {
            boost += 10;
            reason += ', preferred location';
        }
        if (prefs === null || prefs === void 0 ? void 0 : prefs.preferredDepartments.some(d => job.department.toLowerCase().includes(d.toLowerCase()))) {
            boost += 10;
            reason += ', preferred department';
        }
        return Object.assign(Object.assign({}, r), { score: Math.min(100, r.score + boost), reason, isNew: !viewedIds.has(r.jobId) });
    });
    // Sort: new jobs first, then by score
    const result = boosted
        .sort((a, b) => {
        if (a.isNew !== b.isNew)
            return a.isNew ? -1 : 1;
        return b.score - a.score;
    })
        .slice(0, limit);
    recommendationCache.set(cacheKey, result);
    return result;
}
function checkProfileCompleteness(candidate) {
    const checks = [
        { field: 'name', present: !!candidate.name, suggestion: 'Add your full name' },
        { field: 'email', present: !!candidate.email, suggestion: 'Add your email address' },
        { field: 'phoneNumber', present: !!candidate.phoneNumber, suggestion: 'Add your phone number for recruiter contact' },
        { field: 'temporaryAddress', present: !!candidate.temporaryAddress, suggestion: 'Add your current address' },
        { field: 'permanentAddress', present: !!candidate.permanentAddress, suggestion: 'Add your permanent address' },
        { field: 'cvUrl', present: !!candidate.cvUrl, suggestion: 'Upload your CV — recruiters need this to review your application' },
    ];
    const missing = checks.filter(c => !c.present);
    const score = Math.round(((checks.length - missing.length) / checks.length) * 100);
    return {
        score,
        missingFields: missing.map(c => c.field),
        suggestions: missing.map(c => c.suggestion),
    };
}
