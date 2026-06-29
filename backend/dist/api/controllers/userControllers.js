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
exports.UserController = void 0;
const roleEnum_1 = require("../../enums/roleEnum");
const models_1 = __importDefault(require("../../models"));
class UserController {
    // Admin: get all users
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.default.Users.findAll({
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    order: [['id', 'ASC']],
                });
                return res.status(200).json({ success: true, data: users });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Admin: assign role to a user (user → recruiter, recruiter → user, etc.)
    static assignRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { role } = req.body;
            try {
                if (!Object.values(roleEnum_1.RoleEnum).includes(role)) {
                    return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${Object.values(roleEnum_1.RoleEnum).join(', ')}` });
                }
                const user = yield models_1.default.Users.findByPk(Number(id));
                if (!user)
                    return res.status(404).json({ success: false, message: "User not found" });
                yield models_1.default.Users.update({ role }, { where: { id: Number(id) } });
                return res.status(200).json({
                    success: true,
                    message: `Role updated to '${role}' successfully`,
                    data: { id: Number(id), role },
                });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    // Admin: delete a user
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield models_1.default.Users.findByPk(Number(id));
                if (!user)
                    return res.status(404).json({ success: false, message: "User not found" });
                yield models_1.default.Users.destroy({ where: { id: Number(id) } });
                return res.status(200).json({ success: true, message: "User deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.UserController = UserController;
