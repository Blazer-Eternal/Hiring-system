"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const application_1 = __importDefault(require("./application"));
const candidate_1 = __importDefault(require("./candidate"));
const jobposition_1 = __importDefault(require("./jobposition"));
const interview_1 = __importDefault(require("./interview"));
const recruiter_1 = __importDefault(require("./recruiter"));
const Models = {
    Users: user_1.default,
    Candidates: candidate_1.default,
    JobPositions: jobposition_1.default,
    Applications: application_1.default,
    Interviews: interview_1.default,
    Recruiters: recruiter_1.default,
};
// Applications ↔ Interviews
application_1.default.hasMany(interview_1.default, { foreignKey: "applicationId", as: "Interviews" });
interview_1.default.belongsTo(application_1.default, { foreignKey: "applicationId", as: "Application" });
// Users ↔ Candidates
candidate_1.default.belongsTo(user_1.default, { foreignKey: "userId", as: "User" });
user_1.default.hasOne(candidate_1.default, { foreignKey: "userId", as: "Candidate" });
// Candidates ↔ Applications
candidate_1.default.hasMany(application_1.default, { foreignKey: "candidateId", as: "Applications" });
application_1.default.belongsTo(candidate_1.default, { foreignKey: "candidateId", as: "Candidate" });
// JobPositions ↔ Applications
jobposition_1.default.hasMany(application_1.default, { foreignKey: "jobId", as: "Applications" });
application_1.default.belongsTo(jobposition_1.default, { foreignKey: "jobId", as: "Job" });
// Candidates ↔ Interviews
candidate_1.default.hasMany(interview_1.default, { foreignKey: "candidateId", as: "Interviews" });
interview_1.default.belongsTo(candidate_1.default, { foreignKey: "candidateId", as: "Candidate" });
// Recruiters ↔ Interviews (recruiterId = Recruiters.id)
recruiter_1.default.hasMany(interview_1.default, { foreignKey: "recruiterId", as: "Interviews" });
interview_1.default.belongsTo(recruiter_1.default, { foreignKey: "recruiterId", as: "Recruiter" });
// Recruiters ↔ JobPositions (recruiterId = Recruiters.id)
recruiter_1.default.hasMany(jobposition_1.default, { foreignKey: "recruiterId", as: "JobPositions" });
jobposition_1.default.belongsTo(recruiter_1.default, { foreignKey: "recruiterId", as: "Recruiter" });
exports.default = Models;
