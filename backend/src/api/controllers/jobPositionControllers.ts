import { Request, Response } from "express";
import { JobServices } from "../../services/jobPositionServices";

export class JobController {
    public static async getAllJobs(req: Request, res: Response): Promise<Response> {
        try {
            const jobs = await new JobServices().findAll();
            return res.status(200).json({
                success: true,
                data: jobs,
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async getJobById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const job = await new JobServices().findById(Number(id));
            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found',
                });
            }
            return res.status(200).json({
                success: true,
                data: job,
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async createJob(req: Request, res: Response): Promise<Response> {
        const jobData = req.body;
        try {
            const newJob = await new JobServices().create(jobData);
            return res.status(201).json({
                success: true,
                message: 'Job created successfully',
                data: newJob,
            });
        } catch (error) {
            console.error('Error creating job:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async updateJob(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const isUpdated = await new JobServices().update(Number(id), updateData);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Job updated successfully',
            });
        } catch (error) {
            console.error('Error updating job:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    public static async deleteJob(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const isDeleted = await new JobServices().delete(Number(id));
            if (!isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Job deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting job:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

}