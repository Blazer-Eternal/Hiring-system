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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const candidateServices_1 = require("../../services/candidateServices");
const models_1 = __importDefault(require("../../models"));
class CandidateController {
    // Admin / Recruiter: list all candidates
    static getAllCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield new candidateServices_1.CandidateServices().findAll();
                return res.status(200).json({ success: true, data: candidates });
            }
            catch (error) {
                console.error('[getAllCandidates] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
    // Admin / Recruiter: get candidate by ID
    static getCandidateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const candidate = yield new candidateServices_1.CandidateServices().findById(Number(id));
                if (!candidate) {
                    return res.status(404).json({ success: false, message: "Candidate not found" });
                }
                return res.status(200).json({ success: true, data: candidate });
            }
            catch (error) {
                console.error('[getCandidateById] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
    // User: create own candidate profile — userId auto-set from JWT
    static createCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield models_1.default.Candidates.findOne({
                    where: { userId: req.user.userId },
                    include: [{ model: models_1.default.Users, as: 'User', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }]
                });
                if (existing) {
                    // Return existing profile — frontend can use it directly
                    return res.status(200).json({ success: true, message: "Profile already exists", data: existing });
                }
                const candidateData = Object.assign(Object.assign({}, req.body), { userId: req.user.userId });
                const newCandidate = yield new candidateServices_1.CandidateServices().create(candidateData);
                return res.status(201).json({ success: true, message: "Candidate profile created successfully", data: newCandidate });
            }
            catch (error) {
                console.error('[createCandidate] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
    // User: update own profile — find by id first, then verify ownership
    static updateCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const numericId = Number(id);
            if (!id || isNaN(numericId)) {
                return res.status(400).json({ success: false, message: "Invalid candidate ID" });
            }
            try {
                if (req.user.role === 'user') {
                    const candidate = yield models_1.default.Candidates.findByPk(numericId);
                    if (!candidate) {
                        return res.status(404).json({ success: false, message: "Candidate not found" });
                    }
                    if (candidate.userId !== req.user.userId) {
                        return res.status(403).json({ success: false, message: "Access denied. You can only update your own profile." });
                    }
                }
                // Strip email and userId — email is unique in DB and must never be updated
                const _a = req.body, { email: _email, userId: _userId } = _a, safeUpdateData = __rest(_a, ["email", "userId"]);
                const updated = yield new candidateServices_1.CandidateServices().update(numericId, safeUpdateData);
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Candidate not found" });
                }
                return res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
            }
            catch (error) {
                console.error('[updateCandidate] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
    // Admin only: delete candidate
    static deleteCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const isDeleted = yield new candidateServices_1.CandidateServices().delete(Number(id));
                if (!isDeleted) {
                    return res.status(404).json({ success: false, message: "Candidate not found" });
                }
                return res.status(200).json({ success: true, message: "Candidate deleted successfully" });
            }
            catch (error) {
                console.error('[deleteCandidate] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
    // User: view own full profile — returns null if no profile yet
    static getMyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield models_1.default.Candidates.findOne({
                    where: { userId: req.user.userId },
                    include: [{ model: models_1.default.Users, as: 'User', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }]
                });
                if (!candidate) {
                    // Return null — frontend shows "create profile" state, not a crash
                    return res.status(200).json({ success: true, data: null });
                }
                return res.status(200).json({ success: true, data: candidate });
            }
            catch (error) {
                console.error('[getMyProfile] Error:', error);
                return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        });
    }
}
exports.CandidateController = CandidateController;
