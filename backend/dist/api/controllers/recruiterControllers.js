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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterControllers = void 0;
const recruiterServices_1 = require("../../services/recruiterServices");
class RecruiterControllers {
    // Admin: list all recruiters
    static getAllRecruiters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiters = yield recruiterServices_1.RecruiterServices.getAll();
                return res.status(200).json({ success: true, data: recruiters });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: get all pending (unverified) recruiters — shown in admin dashboard
    static getPendingRecruiters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pending = yield recruiterServices_1.RecruiterServices.getPending();
                return res.status(200).json({
                    success: true,
                    message: `${pending.length} recruiter(s) awaiting verification`,
                    data: pending,
                });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: get all verified recruiters
    static getVerifiedRecruiters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verified = yield recruiterServices_1.RecruiterServices.getVerified();
                return res.status(200).json({ success: true, data: verified });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: approve a recruiter — sets isVerified = true
    static approveRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.verify(Number(req.params.id));
                if (!recruiter)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                return res.status(200).json({
                    success: true,
                    message: `Recruiter ${recruiter.firstName} ${recruiter.lastName} has been approved and can now login.`,
                    data: { id: recruiter.id, isVerified: true },
                });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: reject a recruiter — deletes their record
    static rejectRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.findById(Number(req.params.id));
                if (!recruiter)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                yield recruiterServices_1.RecruiterServices.delete(Number(req.params.id));
                return res.status(200).json({
                    success: true,
                    message: `Recruiter application has been rejected and removed.`,
                });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: get specific recruiter by id
    static getRecruiterById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.findById(Number(req.params.id));
                if (!recruiter)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                return res.status(200).json({ success: true, data: recruiter });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Admin: delete a recruiter
    static deleteRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.findById(Number(req.params.id));
                if (!recruiter)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                yield recruiterServices_1.RecruiterServices.delete(Number(req.params.id));
                return res.status(200).json({ success: true, message: "Recruiter deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Recruiter: view own profile
    static getMyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiter = yield recruiterServices_1.RecruiterServices.findById(req.user.recruiterId);
                if (!recruiter)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                const _a = recruiter, { password: _ } = _a, safeData = __rest(_a, ["password"]);
                return res.status(200).json({ success: true, data: safeData });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Recruiter: update own profile
    static updateMyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield recruiterServices_1.RecruiterServices.update(req.user.recruiterId, req.body);
                if (!updated)
                    return res.status(404).json({ success: false, message: "Recruiter not found" });
                return res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Recruiter: view all applications for their posted jobs
    static viewApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const applications = yield recruiterServices_1.RecruiterServices.getApplicationsForRecruiter(req.user.recruiterId);
                return res.status(200).json({ success: true, message: `Found ${applications.length} applications`, data: applications });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    // Recruiter: view all interviews they scheduled
    static viewInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const interviews = yield recruiterServices_1.RecruiterServices.getInterviewsForRecruiter(req.user.recruiterId);
                return res.status(200).json({ success: true, message: `Found ${interviews.length} interviews`, data: interviews });
            }
            catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
exports.RecruiterControllers = RecruiterControllers;
