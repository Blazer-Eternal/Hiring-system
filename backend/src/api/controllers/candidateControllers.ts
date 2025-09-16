import { Request, Response } from "express";
import { CandidateServices } from "../../services/candidateServices";


export class CandidateController {
    public static async getAllCandidates(req: Request, res: Response): Promise<Response> {
        try {
            const candidates = await new CandidateServices().findAll();
            return res.status(200).json({
                success: true,
                data: candidates,
            });
        } catch (error) {
            console.error('Error fetching candidates:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async getCandidateById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const candidate = await new CandidateServices().findById(Number(id));
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
        } catch (error) {
            console.error('Error fetching candidate:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async createCandidate(req: Request, res: Response): Promise<Response> {
        const candidateData = req.body;
        try {
            const newCandidate = await new CandidateServices().create(candidateData);
            return res.status(201).json({
                success: true,
                message: 'Candidate created successfully',
                data: newCandidate,
            });
        } catch (error) {
            console.error('Error creating candidate:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async updateCandidate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const updatedCandidate = await new CandidateServices().update(Number(id), updateData);
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
        } catch (error) {
            console.error('Error updating candidate:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async deleteCandidate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const isDeleted = await new CandidateServices().delete(Number(id));
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
        } catch (error) {
            console.error('Error deleting candidate:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}