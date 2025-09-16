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
const Models = {
    Users: user_1.default,
    Candidates: candidate_1.default,
    JobPositions: jobposition_1.default,
    Applications: application_1.default,
    Interviews: interview_1.default
};
// An Application can have many Interviews
application_1.default.hasMany(interview_1.default, {
    foreignKey: "applicationId",
    as: "Interviews"
});
// An Interview belongs to one Application
interview_1.default.belongsTo(application_1.default, {
    foreignKey: "applicationId",
    as: "Application"
});
exports.default = Models;
