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
exports.ApplicationServices = void 0;
const models_1 = __importDefault(require("../models"));
class ApplicationServices {
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield models_1.default.Applications.findAll({
                where: filters
            });
            return applications;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield models_1.default.Applications.findByPk(id);
            return application;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield models_1.default.Applications.create(data);
            return application;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updated] = yield models_1.default.Applications.update(data, {
                where: { id },
            });
            return updated === 1;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield models_1.default.Applications.destroy({
                where: { id },
            });
            return deleted > 0;
        });
    }
    findByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield models_1.default.Applications.findAll({
                where: { jobId },
            });
            return applications;
        });
    }
    findByCandidateId(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield models_1.default.Applications.findAll({
                where: { candidateId },
            });
            return applications;
        });
    }
    findbyInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield models_1.default.Applications.findAll({
                where: { interviewId },
            });
            return applications;
        });
    }
}
exports.ApplicationServices = ApplicationServices;
