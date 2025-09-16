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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const candidateServices_1 = require("../../services/candidateServices");
class CandidateController {
    static getAllCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield new candidateServices_1.CandidateServices().findAll();
                return res.status(200).json({
                    success: true,
                    data: candidates,
                });
            }
            catch (error) {
                console.error('Error fetching candidates:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static getCandidateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const candidate = yield new candidateServices_1.CandidateServices().findById(Number(id));
                if (!candidate) {
                    return res.status(404).json({
                        success: false,
                        message: 'Candidate not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: candidate,
                });
            }
            catch (error) {
                console.error('Error fetching candidate:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static createCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateData = req.body;
            try {
                const newCandidate = yield new candidateServices_1.CandidateServices().create(candidateData);
                return res.status(201).json({
                    success: true,
                    message: 'Candidate created successfully',
                    data: newCandidate,
                });
            }
            catch (error) {
                console.error('Error creating candidate:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static updateCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const updatedCandidate = yield new candidateServices_1.CandidateServices().update(Number(id), updateData);
                if (!updatedCandidate) {
                    return res.status(404).json({
                        success: false,
                        message: 'Candidate not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Candidate updated successfully',
                    data: updatedCandidate,
                });
            }
            catch (error) {
                console.error('Error updating candidate:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
    static deleteCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const isDeleted = yield new candidateServices_1.CandidateServices().delete(Number(id));
                if (!isDeleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Candidate not found',
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Candidate deleted successfully',
                });
            }
            catch (error) {
                console.error('Error deleting candidate:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        });
    }
}
exports.CandidateController = CandidateController;
