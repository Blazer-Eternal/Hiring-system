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
exports.CandidateServices = void 0;
const models_1 = __importDefault(require("../models"));
class CandidateServices {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.default.Candidates.findAll();
            return data;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield models_1.default.Candidates.findByPk(id);
            return candidate;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield models_1.default.Candidates.create(data);
            return candidate;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield models_1.default.Candidates.update(data, {
                where: {
                    id: id,
                },
            });
            return update[0] === 0 ? false : true;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield models_1.default.Candidates.destroy({
                where: {
                    id: id,
                },
            });
            return deleted > 0;
        });
    }
}
exports.CandidateServices = CandidateServices;
