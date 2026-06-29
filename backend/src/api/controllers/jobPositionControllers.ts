import { Response } from "express";
import { JobServices } from "../../services/jobPositionServices";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

export class JobController {
  // Public: browse all open jobs
  public static async getAllJobs(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const { status, recruiterId } = req.query;
      const jobs = await new JobServices().findAll({
        status: status as any,
        recruiterId: recruiterId ? Number(recruiterId) : undefined,
      });
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async getJobById(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const job = await new JobServices().findById(Number(id));
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      return res.status(200).json({ success: true, data: job });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Recruiter: post a job — recruiterId from JWT
  public static async createJob(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const newJob = await new JobServices().create({ ...req.body, recruiterId: req.user.recruiterId });
      return res.status(201).json({ success: true, message: "Job posted successfully", data: newJob });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Recruiter (own jobs) / Admin: update
  public static async updateJob(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const job = await new JobServices().findById(Number(id));
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      if (req.user.role !== 'admin' && job.recruiterId !== req.user.recruiterId) {
        return res.status(403).json({ success: false, message: "Access denied. You can only update your own jobs." });
      }
      await new JobServices().update(Number(id), req.body);
      return res.status(200).json({ success: true, message: "Job updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Recruiter (own jobs) / Admin: delete
  public static async deleteJob(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const job = await new JobServices().findById(Number(id));
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      if (req.user.role !== 'admin' && job.recruiterId !== req.user.recruiterId) {
        return res.status(403).json({ success: false, message: "Access denied. You can only delete your own jobs." });
      }
      await new JobServices().delete(Number(id));
      return res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Recruiter: view own posted jobs
  public static async getMyJobs(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const jobs = await new JobServices().findByRecruiterId(req.user.recruiterId!);
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
