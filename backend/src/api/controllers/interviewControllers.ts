import { Request, Response } from "express";
import { InterviewServices } from "../../services/interviewServices";
import { InterviewStatusEnum } from "../../enums/interviewStatusEnum";

export class InterviewController {
    // Schedule new interview (CREATE)
    public static async scheduleInterview(req: Request, res: Response): Promise<Response> {
        try {
            const interview = await new InterviewServices().create(req.body);
            return res.status(201).json({
                success: true,
                message: "Interview scheduled successfully",
                data: interview,
            });
        } catch (error) {
            console.error("Error scheduling interview:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // List all interviews (READ)
    public static async getAllInterviews(req: Request, res: Response): Promise<Response> {
        try {
            const filters = req.query;
            const interviews = await new InterviewServices().findAll();
            return res.status(200).json({
                success: true,
                data: interviews,
            });
        } catch (error) {
            console.error("Error fetching interviews:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // Get interview details (READ)
    public static async getInterviewDetails(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const interview = await new InterviewServices().findById(Number(id));
            if (!interview) {
                return res.status(404).json({
                    success: false,
                    message: "Interview not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: interview,
            });
        } catch (error) {
            console.error("Error fetching interview:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // Update interview schedule (UPDATE)
    public static async updateInterview(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const isUpdated = await new InterviewServices().update(Number(id), req.body);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: "Interview not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Interview updated successfully",
            });
        } catch (error) {
            console.error("Error updating interview:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // Update interview status (UPDATE)
    public static async updateInterviewStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { status } = req.body;
        try {
            if (!Object.values(InterviewStatusEnum).includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value",
                });
            }
            const isUpdated = await new InterviewServices().update(Number(id), status);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: "Interview not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Interview status updated successfully",
            });
        } catch (error) {
            console.error("Error updating interview status:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // Add interview feedback (UPDATE)
    public static async updateInterviewFeedback(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { feedback, rating } = req.body;
        try {
            if (!feedback) {
                return res.status(400).json({
                    success: false,
                    message: "Feedback is required",
                });
            }
            const isUpdated = await new InterviewServices().updateFeedback(Number(id), feedback, rating);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: "Interview not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Interview feedback updated successfully",
            });
        } catch (error) {
            console.error("Error updating interview feedback:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

//     Get interviews for an application (READ)
//     public static async getApplicationInterviews(req: Request, res: Response): Promise<Response> {
//         const { id } = req.params;
//         try {
//             const interviews = await new InterviewServices().findByApplicationId(Number(id));
//             return res.status(200).json({
//                 success: true,
//                 data: interviews,
//             });
//         } catch (error) {
//             console.error("Error fetching application interviews:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Internal server error",
//             });
//         }
//     }
}