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
exports.attachInterviewHooks = attachInterviewHooks;
const application_1 = __importDefault(require("../models/application"));
function attachInterviewHooks(Interviews) {
    Interviews.addHook("afterUpdate", (interview) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const ApplicationsModel = ((_a = interview.sequelize) === null || _a === void 0 ? void 0 : _a.models.Applications) || application_1.default;
        if (!ApplicationsModel)
            return;
        switch (interview.status) {
            case "SCHEDULED":
                yield ApplicationsModel.update({ status: "INTERVIEW" }, { where: { id: interview.applicationId } });
                break;
            case "COMPLETED":
                if (interview.rating && interview.rating >= 3) {
                    yield ApplicationsModel.update({ status: "HIRED" }, { where: { id: interview.applicationId } });
                }
                else {
                    yield ApplicationsModel.update({ status: "REJECTED" }, { where: { id: interview.applicationId } });
                }
                break;
            case "CANCELLED":
                yield ApplicationsModel.update({ status: "UNDER_REVIEW" }, { where: { id: interview.applicationId } });
                break;
        }
    }));
}
