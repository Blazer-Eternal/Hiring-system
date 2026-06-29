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
exports.JobServices = void 0;
const models_1 = __importDefault(require("../models"));
class JobServices {
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (filters === null || filters === void 0 ? void 0 : filters.status)
                where.status = filters.status;
            if (filters === null || filters === void 0 ? void 0 : filters.recruiterId)
                where.recruiterId = filters.recruiterId;
            return yield models_1.default.JobPositions.findAll({ where });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.JobPositions.findByPk(id, {
                include: [{ model: models_1.default.Users, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.JobPositions.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updated] = yield models_1.default.JobPositions.update(data, { where: { id } });
            return updated > 0;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield models_1.default.JobPositions.destroy({ where: { id } });
            return deleted > 0;
        });
    }
    findByRecruiterId(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.JobPositions.findAll({ where: { recruiterId } });
        });
    }
}
exports.JobServices = JobServices;
