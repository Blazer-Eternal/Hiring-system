import { Response } from "express";
import { DashboardServices } from "../../services/dashboardServices";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

const svc = new DashboardServices();

export class DashboardController {
  // Admin: full system — all users, hired/rejected, interview schedules, recruiter list
  public static async getAdminStats(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const data = await svc.getAdminStats();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch admin dashboard", error: error.message });
    }
  }

  // Recruiter: own pipeline, job performance, upcoming interviews
  public static async getRecruiterStats(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const data = await svc.getRecruiterStats(req.user.recruiterId!);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch recruiter dashboard", error: error.message });
    }
  }

  // User/Candidate: own applications, interview schedule, rejections, offers
  public static async getUserStats(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) {
        // Return empty dashboard — don't crash with 404
        return res.status(200).json({
          success: true,
          data: {
            overview: { totalApplications: 0, activeApplications: 0, upcomingInterviews: 0, totalHires: 0 },
            applicationStatus: { applied: 0, underReview: 0, interview: 0, hired: 0, rejected: 0 },
            recentApplications: [],
            upcomingInterviews: [],
            activityFeed: [],
          }
        });
      }
      const data = await svc.getUserStats(candidate.id);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch user dashboard", error: error.message });
    }
  }
}
