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
exports.DashboardServices = void 0;
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
// ─── Helpers ─────────────────────────────────────────────────────────────────
function monthLabel(date) {
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}
function last6MonthsRange() {
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        d.setHours(0, 0, 0, 0);
        months.push(d);
    }
    return months;
}
function daysBetween(a, b) {
    return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}
function safeRate(numerator, denominator) {
    if (denominator === 0)
        return 0;
    return Math.round((numerator / denominator) * 1000) / 10; // one decimal %
}
// ─── Admin Dashboard ─────────────────────────────────────────────────────────
class DashboardServices {
    getAdminStats() {
        return __awaiter(this, void 0, void 0, function* () {
            // ── Overview ──────────────────────────────────────────────────────────
            const [totalUsers, totalCandidates, totalRecruiters, activeJobs, closedJobs, totalApplications, totalInterviews, totalHires,] = yield Promise.all([
                models_1.default.Users.count(),
                models_1.default.Candidates.count(),
                models_1.default.Recruiters.count({ where: { isVerified: true } }),
                models_1.default.JobPositions.count({ where: { status: "open" } }),
                models_1.default.JobPositions.count({ where: { status: "closed" } }),
                models_1.default.Applications.count(),
                models_1.default.Interviews.count(),
                models_1.default.Applications.count({ where: { status: "hired" } }),
            ]);
            // ── Hiring Funnel ─────────────────────────────────────────────────────
            const [applied, underReview, interview, hired, rejected] = yield Promise.all([
                models_1.default.Applications.count({ where: { status: "applied" } }),
                models_1.default.Applications.count({ where: { status: "under_review" } }),
                models_1.default.Applications.count({ where: { status: "interview" } }),
                models_1.default.Applications.count({ where: { status: "hired" } }),
                models_1.default.Applications.count({ where: { status: "rejected" } }),
            ]);
            const hiringFunnel = {
                applied,
                underReview,
                interview,
                hired,
                rejected,
                offerAcceptanceRate: safeRate(hired, hired + rejected),
                applicationToInterviewRate: safeRate(interview, applied),
                interviewToHireRate: safeRate(hired, interview),
            };
            // ── Time Metrics ──────────────────────────────────────────────────────
            const hiredApps = yield models_1.default.Applications.findAll({
                where: { status: "hired" },
                attributes: ["createdAt", "updatedAt"],
            });
            const avgTimeToHireDays = hiredApps.length > 0
                ? Math.round(hiredApps.reduce((sum, a) => {
                    return sum + daysBetween(new Date(a.createdAt), new Date(a.updatedAt));
                }, 0) / hiredApps.length)
                : 0;
            const reviewedApps = yield models_1.default.Applications.findAll({
                where: { status: { [sequelize_1.Op.ne]: "applied" } },
                attributes: ["createdAt", "updatedAt"],
            });
            const avgTimeToFirstActionDays = reviewedApps.length > 0
                ? Math.round(reviewedApps.reduce((sum, a) => {
                    return sum + daysBetween(new Date(a.createdAt), new Date(a.updatedAt));
                }, 0) / reviewedApps.length)
                : 0;
            const avgDurationResult = yield models_1.default.Interviews.findOne({
                attributes: [[(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("duration")), "avgDuration"]],
            });
            const avgInterviewDurationMinutes = Math.round(parseFloat((avgDurationResult === null || avgDurationResult === void 0 ? void 0 : avgDurationResult.get("avgDuration")) || "0"));
            // ── Monthly Trends (last 6 months) ────────────────────────────────────
            const months = last6MonthsRange();
            const applicationTrend = [];
            const hireTrend = [];
            for (let i = 0; i < months.length; i++) {
                const start = months[i];
                const end = i + 1 < months.length ? months[i + 1] : new Date();
                const [appCount, hireCount] = yield Promise.all([
                    models_1.default.Applications.count({ where: { createdAt: { [sequelize_1.Op.gte]: start, [sequelize_1.Op.lt]: end } } }),
                    models_1.default.Applications.count({
                        where: { status: "hired", updatedAt: { [sequelize_1.Op.gte]: start, [sequelize_1.Op.lt]: end } },
                    }),
                ]);
                applicationTrend.push({ month: monthLabel(start), count: appCount });
                hireTrend.push({ month: monthLabel(start), count: hireCount });
            }
            // ── Top Recruiters ────────────────────────────────────────────────────
            const allRecruiters = yield models_1.default.Recruiters.findAll({ where: { isVerified: true } });
            const topRecruitersRaw = yield Promise.all(allRecruiters.map((r) => __awaiter(this, void 0, void 0, function* () {
                const jobs = yield models_1.default.JobPositions.findAll({ where: { recruiterId: r.id } });
                const jobIds = jobs.map((j) => j.id);
                const [totalApplications, totalHiresR, activeJobsR, avgRatingResult] = yield Promise.all([
                    jobIds.length > 0 ? models_1.default.Applications.count({ where: { jobId: jobIds } }) : Promise.resolve(0),
                    jobIds.length > 0 ? models_1.default.Applications.count({ where: { jobId: jobIds, status: "hired" } }) : Promise.resolve(0),
                    models_1.default.JobPositions.count({ where: { recruiterId: r.id, status: "open" } }),
                    models_1.default.Interviews.findOne({
                        where: { recruiterId: r.id, rating: { [sequelize_1.Op.ne]: null } },
                        attributes: [[(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("rating")), "avgRating"]],
                    }),
                ]);
                const avgRating = avgRatingResult
                    ? parseFloat(avgRatingResult.get("avgRating") || "0") || null
                    : null;
                return {
                    recruiterId: r.id,
                    company: `${r.firstName} ${r.lastName}`,
                    totalHires: totalHiresR,
                    activeJobs: activeJobsR,
                    totalApplications,
                    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
                };
            })));
            const topRecruiters = topRecruitersRaw
                .sort((a, b) => b.totalHires - a.totalHires)
                .slice(0, 5);
            // ── Recent Hires ──────────────────────────────────────────────────────
            const recentHireApps = yield models_1.default.Applications.findAll({
                where: { status: "hired" },
                order: [["updatedAt", "DESC"]],
                limit: 10,
                include: [
                    { model: models_1.default.Candidates, as: "Candidate", attributes: ["name"] },
                    {
                        model: models_1.default.JobPositions,
                        as: "Job",
                        attributes: ["title"],
                        include: [{ model: models_1.default.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] }],
                    },
                ],
            });
            const recentHires = recentHireApps.map((a) => {
                var _a, _b, _c, _d, _e;
                return ({
                    candidateName: (_b = (_a = a.Candidate) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown",
                    jobTitle: (_d = (_c = a.Job) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : "Unknown",
                    company: ((_e = a.Job) === null || _e === void 0 ? void 0 : _e.Recruiter)
                        ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}`
                        : "Unknown",
                    hiredAt: a.updatedAt,
                });
            });
            return {
                overview: {
                    totalUsers,
                    totalCandidates,
                    totalRecruiters,
                    activeJobs,
                    closedJobs,
                    totalApplications,
                    totalInterviews,
                    totalHires,
                },
                hiringFunnel,
                timeMetrics: {
                    avgTimeToHireDays,
                    avgTimeToFirstActionDays,
                    avgInterviewDurationMinutes,
                },
                applicationTrend,
                hireTrend,
                topRecruiters,
                recentHires,
            };
        });
    }
    // ─── Recruiter Dashboard ────────────────────────────────────────────────────
    getRecruiterStats(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiterJobs = yield models_1.default.JobPositions.findAll({ where: { recruiterId } });
            const jobIds = recruiterJobs.map((j) => j.id);
            // ── Overview ──────────────────────────────────────────────────────────
            const [totalApplicationsReceived, scheduledInterviews, completedInterviews, totalHires, candidatesInPipeline,] = yield Promise.all([
                jobIds.length > 0 ? models_1.default.Applications.count({ where: { jobId: jobIds } }) : Promise.resolve(0),
                models_1.default.Interviews.count({ where: { recruiterId, status: "scheduled" } }),
                models_1.default.Interviews.count({ where: { recruiterId, status: "completed" } }),
                jobIds.length > 0 ? models_1.default.Applications.count({ where: { jobId: jobIds, status: "hired" } }) : Promise.resolve(0),
                jobIds.length > 0
                    ? models_1.default.Applications.count({
                        where: { jobId: jobIds, status: { [sequelize_1.Op.in]: ["applied", "under_review", "interview"] } },
                    })
                    : Promise.resolve(0),
            ]);
            const activeJobs = recruiterJobs.filter((j) => j.status === "open").length;
            const closedJobs = recruiterJobs.filter((j) => j.status === "closed").length;
            // ── Hiring Funnel ─────────────────────────────────────────────────────
            const [fApplied, fUnderReview, fInterview, fHired, fRejected] = yield Promise.all(jobIds.length > 0
                ? [
                    models_1.default.Applications.count({ where: { jobId: jobIds, status: "applied" } }),
                    models_1.default.Applications.count({ where: { jobId: jobIds, status: "under_review" } }),
                    models_1.default.Applications.count({ where: { jobId: jobIds, status: "interview" } }),
                    models_1.default.Applications.count({ where: { jobId: jobIds, status: "hired" } }),
                    models_1.default.Applications.count({ where: { jobId: jobIds, status: "rejected" } }),
                ]
                : [Promise.resolve(0), Promise.resolve(0), Promise.resolve(0), Promise.resolve(0), Promise.resolve(0)]);
            const hiringFunnel = {
                applied: fApplied,
                underReview: fUnderReview,
                interview: fInterview,
                hired: fHired,
                rejected: fRejected,
                applicantToInterviewRate: safeRate(fInterview, fApplied),
                interviewToOfferRate: safeRate(fHired, fInterview),
                offerAcceptanceRate: safeRate(fHired, fHired + fRejected),
            };
            // ── Time Metrics ──────────────────────────────────────────────────────
            let avgTimeToFirstReviewDays = 0;
            let avgTimeToHireDays = 0;
            if (jobIds.length > 0) {
                const reviewedApps = yield models_1.default.Applications.findAll({
                    where: { jobId: jobIds, status: { [sequelize_1.Op.ne]: "applied" } },
                    attributes: ["createdAt", "updatedAt"],
                });
                if (reviewedApps.length > 0) {
                    avgTimeToFirstReviewDays = Math.round(reviewedApps.reduce((s, a) => s + daysBetween(new Date(a.createdAt), new Date(a.updatedAt)), 0) /
                        reviewedApps.length);
                }
                const hiredApps = yield models_1.default.Applications.findAll({
                    where: { jobId: jobIds, status: "hired" },
                    attributes: ["createdAt", "updatedAt"],
                });
                if (hiredApps.length > 0) {
                    avgTimeToHireDays = Math.round(hiredApps.reduce((s, a) => s + daysBetween(new Date(a.createdAt), new Date(a.updatedAt)), 0) /
                        hiredApps.length);
                }
            }
            const avgRatingResult = yield models_1.default.Interviews.findOne({
                where: { recruiterId, rating: { [sequelize_1.Op.ne]: null } },
                attributes: [[(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("rating")), "avgRating"]],
            });
            const avgInterviewRating = avgRatingResult
                ? Math.round(parseFloat(avgRatingResult.get("avgRating") || "0") * 10) / 10 || null
                : null;
            // ── Per-Job Performance ───────────────────────────────────────────────
            const jobPerformance = yield Promise.all(recruiterJobs.map((job) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const [appCount, inPipeline, interviews, hires, avgJobRatingResult] = yield Promise.all([
                    models_1.default.Applications.count({ where: { jobId: job.id } }),
                    models_1.default.Applications.count({
                        where: { jobId: job.id, status: { [sequelize_1.Op.in]: ["applied", "under_review", "interview"] } },
                    }),
                    models_1.default.Interviews.count({ where: { recruiterId, applicationId: job.id } }),
                    models_1.default.Applications.count({ where: { jobId: job.id, status: "hired" } }),
                    models_1.default.Interviews.findOne({
                        where: { recruiterId, rating: { [sequelize_1.Op.ne]: null } },
                        attributes: [[(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("rating")), "avgRating"]],
                    }),
                ]);
                const daysOpen = daysBetween(new Date((_a = job.createdAt) !== null && _a !== void 0 ? _a : new Date()), new Date());
                const avgJobRating = avgJobRatingResult
                    ? Math.round(parseFloat(avgJobRatingResult.get("avgRating") || "0") * 10) / 10 || null
                    : null;
                return {
                    jobId: job.id,
                    title: job.title,
                    status: job.status,
                    totalApplications: appCount,
                    inPipeline,
                    interviews,
                    hires,
                    daysOpen,
                    avgRating: avgJobRating,
                };
            })));
            // ── Recent Applications ───────────────────────────────────────────────
            const recentApps = [];
            if (jobIds.length > 0) {
                const rawApps = yield models_1.default.Applications.findAll({
                    where: { jobId: jobIds },
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                    include: [
                        { model: models_1.default.Candidates, as: "Candidate", attributes: ["name"] },
                        { model: models_1.default.JobPositions, as: "Job", attributes: ["title"] },
                    ],
                });
                rawApps.forEach((a) => {
                    var _a, _b, _c, _d;
                    recentApps.push({
                        applicationId: a.id,
                        candidateName: (_b = (_a = a.Candidate) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown",
                        jobTitle: (_d = (_c = a.Job) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : "Unknown",
                        status: a.status,
                        appliedAt: a.createdAt,
                    });
                });
            }
            // ── Upcoming Interviews ───────────────────────────────────────────────
            const rawInterviews = yield models_1.default.Interviews.findAll({
                where: {
                    recruiterId,
                    status: "scheduled",
                    scheduleDate: { [sequelize_1.Op.gte]: new Date() },
                },
                order: [["scheduleDate", "ASC"]],
                limit: 10,
                include: [
                    { model: models_1.default.Candidates, as: "Candidate", attributes: ["name"] },
                ],
            });
            const upcomingInterviews = yield Promise.all(rawInterviews.map((iv) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const app = yield models_1.default.Applications.findByPk(iv.applicationId, {
                    include: [{ model: models_1.default.JobPositions, as: "Job", attributes: ["title"] }],
                });
                return {
                    interviewId: iv.id,
                    candidateName: (_b = (_a = iv.Candidate) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown",
                    jobTitle: (_d = (_c = app === null || app === void 0 ? void 0 : app.Job) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : "Unknown",
                    scheduleDate: iv.scheduleDate,
                    duration: iv.duration,
                    status: iv.status,
                };
            })));
            // ── Monthly Application Trend ─────────────────────────────────────────
            const months = last6MonthsRange();
            const applicationTrend = [];
            for (let i = 0; i < months.length; i++) {
                const start = months[i];
                const end = i + 1 < months.length ? months[i + 1] : new Date();
                const count = jobIds.length > 0
                    ? yield models_1.default.Applications.count({
                        where: { jobId: jobIds, createdAt: { [sequelize_1.Op.gte]: start, [sequelize_1.Op.lt]: end } },
                    })
                    : 0;
                applicationTrend.push({ month: monthLabel(start), count });
            }
            return {
                overview: {
                    totalJobsPosted: recruiterJobs.length,
                    activeJobs,
                    closedJobs,
                    totalApplicationsReceived,
                    candidatesInPipeline,
                    scheduledInterviews,
                    completedInterviews,
                    totalHires,
                },
                hiringFunnel,
                timeMetrics: {
                    avgTimeToFirstReviewDays,
                    avgTimeToHireDays,
                    avgInterviewRating,
                },
                jobPerformance,
                recentApplications: recentApps,
                upcomingInterviews,
                applicationTrend,
            };
        });
    }
    // ─── Candidate (User) Dashboard ─────────────────────────────────────────────
    getUserStats(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            // ── Overview ──────────────────────────────────────────────────────────
            const [totalApplications, upcomingInterviews, totalHires] = yield Promise.all([
                models_1.default.Applications.count({ where: { candidateId } }),
                models_1.default.Interviews.count({
                    where: { candidateId, status: "scheduled", scheduleDate: { [sequelize_1.Op.gte]: new Date() } },
                }),
                models_1.default.Applications.count({ where: { candidateId, status: "hired" } }),
            ]);
            const activeApplications = yield models_1.default.Applications.count({
                where: { candidateId, status: { [sequelize_1.Op.in]: ["applied", "under_review", "interview"] } },
            });
            // ── Status Breakdown ──────────────────────────────────────────────────
            const [sApplied, sUnderReview, sInterview, sHired, sRejected] = yield Promise.all([
                models_1.default.Applications.count({ where: { candidateId, status: "applied" } }),
                models_1.default.Applications.count({ where: { candidateId, status: "under_review" } }),
                models_1.default.Applications.count({ where: { candidateId, status: "interview" } }),
                models_1.default.Applications.count({ where: { candidateId, status: "hired" } }),
                models_1.default.Applications.count({ where: { candidateId, status: "rejected" } }),
            ]);
            // ── Recent Applications ───────────────────────────────────────────────
            const rawApps = yield models_1.default.Applications.findAll({
                where: { candidateId },
                order: [["createdAt", "DESC"]],
                limit: 10,
                include: [
                    {
                        model: models_1.default.JobPositions,
                        as: "Job",
                        attributes: ["title", "location"],
                        include: [{ model: models_1.default.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] }],
                    },
                ],
            });
            const recentApplications = rawApps.map((a) => {
                var _a, _b, _c, _d, _e;
                return ({
                    applicationId: a.id,
                    jobTitle: (_b = (_a = a.Job) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "Unknown",
                    company: ((_c = a.Job) === null || _c === void 0 ? void 0 : _c.Recruiter)
                        ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}`
                        : "Unknown",
                    location: (_e = (_d = a.Job) === null || _d === void 0 ? void 0 : _d.location) !== null && _e !== void 0 ? _e : "Unknown",
                    status: a.status,
                    appliedAt: a.createdAt,
                    lastUpdated: a.updatedAt,
                });
            });
            // ── Upcoming Interviews ───────────────────────────────────────────────
            const rawInterviews = yield models_1.default.Interviews.findAll({
                where: {
                    candidateId,
                    scheduleDate: { [sequelize_1.Op.gte]: new Date() },
                },
                order: [["scheduleDate", "ASC"]],
                limit: 5,
                include: [
                    { model: models_1.default.Recruiters, as: "Recruiter", attributes: ["firstName", "lastName"] },
                ],
            });
            const upcomingInterviewDetails = yield Promise.all(rawInterviews.map((iv) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const app = yield models_1.default.Applications.findByPk(iv.applicationId, {
                    include: [{ model: models_1.default.JobPositions, as: "Job", attributes: ["title"] }],
                });
                return {
                    interviewId: iv.id,
                    jobTitle: (_b = (_a = app === null || app === void 0 ? void 0 : app.Job) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "Unknown",
                    company: iv.Recruiter
                        ? `${iv.Recruiter.firstName} ${iv.Recruiter.lastName}`
                        : "Unknown",
                    scheduleDate: iv.scheduleDate,
                    duration: iv.duration,
                    status: iv.status,
                    feedback: (_c = iv.feedback) !== null && _c !== void 0 ? _c : undefined,
                    rating: (_d = iv.rating) !== null && _d !== void 0 ? _d : undefined,
                };
            })));
            // ── Activity Feed ─────────────────────────────────────────────────────
            const activityFeed = [];
            // Last 5 applications
            rawApps.slice(0, 5).forEach((a) => {
                var _a, _b, _c, _d, _e;
                activityFeed.push({
                    type: "applied",
                    message: `You applied for "${(_b = (_a = a.Job) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "a job"}" at ${((_c = a.Job) === null || _c === void 0 ? void 0 : _c.Recruiter) ? `${a.Job.Recruiter.firstName} ${a.Job.Recruiter.lastName}` : "a company"}`,
                    date: a.createdAt,
                });
                if (a.status !== "applied") {
                    activityFeed.push({
                        type: "status_change",
                        message: `Your application for "${(_e = (_d = a.Job) === null || _d === void 0 ? void 0 : _d.title) !== null && _e !== void 0 ? _e : "a job"}" moved to ${a.status.replace("_", " ")}`,
                        date: a.updatedAt,
                    });
                }
            });
            // Scheduled interviews
            rawInterviews.forEach((iv) => {
                activityFeed.push({
                    type: "interview_scheduled",
                    message: `Interview scheduled with ${iv.Recruiter ? `${iv.Recruiter.firstName} ${iv.Recruiter.lastName}` : "a recruiter"} on ${new Date(iv.scheduleDate).toLocaleDateString()}`,
                    date: iv.createdAt,
                });
                if (iv.feedback) {
                    activityFeed.push({
                        type: "feedback_received",
                        message: `Feedback received: "${iv.feedback}"`,
                        date: iv.updatedAt,
                    });
                }
            });
            // Sort by date desc, take top 10
            activityFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return {
                overview: {
                    totalApplications,
                    activeApplications,
                    upcomingInterviews,
                    totalHires,
                },
                applicationStatus: {
                    applied: sApplied,
                    underReview: sUnderReview,
                    interview: sInterview,
                    hired: sHired,
                    rejected: sRejected,
                },
                recentApplications,
                upcomingInterviews: upcomingInterviewDetails,
                activityFeed: activityFeed.slice(0, 10),
            };
        });
    }
}
exports.DashboardServices = DashboardServices;
