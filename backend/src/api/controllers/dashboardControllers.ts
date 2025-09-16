import { Request, Response } from "express";
import { DashboardServices } from "../../services/dashboardServices";

const dashboardServices = new DashboardServices();

export class DashboardController {
  // Admin dashboard stats
  public async getAdminStats(req: Request, res: Response): Promise<Response> {
    try {
      const data = await dashboardServices.getAdminStats();
      return res.status(200).json({
        success: true,
        message: "Admin dashboard stats fetched successfully",
        data
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin dashboard stats",
        error: error.message
      });
    }
  }

  // User dashboard stats
  public async getUserStats(req: Request, res: Response): Promise<Response> {
    try {
      const userId = Number(req.params.userId); // assuming userId is passed as param
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid userId"
        });
      }

      const data = await dashboardServices.getUserStats(userId);
      return res.status(200).json({
        success: true,
        message: "User dashboard stats fetched successfully",
        data
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user dashboard stats",
        error: error.message
      });
    }
  }
}
