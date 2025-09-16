import { Request, Response } from "express";
import { ApplicationServices } from "../../services/applicationServices";
import { ApplicationStatusEnum } from "../../enums";

export class ApplicationController {
    public static async createApplication(req: Request, res: Response): Promise<Response> {
        const applicationData = req.body;
        try {
            const newApplication = await new ApplicationServices().create(applicationData);
            return res.status(201).json({
                success: true,
                message: "Application submitted successfully",
                data: newApplication,
            });
        } catch (error) {
            console.error("Error creating application:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async getAllApplications(req: Request, res: Response): Promise<Response> {
        try {
            const filters = req.query;
            const applications = await new ApplicationServices().findAll(filters);
            return res.status(200).json({
                success: true,
                data: applications,
            });
        } catch (error) {
            console.error("Error fetching applications:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async getApplicationById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const application = await new ApplicationServices().findById(Number(id));
            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: application,
            });
        } catch (error) {
            console.error("Error fetching application:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async updateApplication(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const isUpdated = await new ApplicationServices().update(Number(id), updateData);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Application updated successfully",
            });
        } catch (error) {
            console.error("Error updating application:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async updateApplicationStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { status } = req.body;
        try {
            if (!Object.values(ApplicationStatusEnum).includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value",
                });
            }
            const isUpdated = await new ApplicationServices().update(Number(id), { status });
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Application status updated successfully",
            });
        } catch (error) {
            console.error("Error updating application status:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async getApplicationsByJob(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const applications = await new ApplicationServices().findByJobId(Number(id));
            return res.status(200).json({
                success: true,
                data: applications,
            });
        } catch (error) {
            console.error("Error fetching applications by job:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async getApplicationsByCandidate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const applications = await new ApplicationServices().findByCandidateId(Number(id));
            return res.status(200).json({
                success: true,
                data: applications,
            });
        } catch (error) {
            console.error("Error fetching applications by candidate:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    public static async getApplicationsByInterview(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const applications = await new ApplicationServices().findbyInterviewId(Number(id));
            return res.status(200).json({
                success: true,
                data: applications,
            });
        } catch (error) {
            console.error("Error fetching applications by interview:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
}