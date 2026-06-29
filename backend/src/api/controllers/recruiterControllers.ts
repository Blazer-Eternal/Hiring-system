import { Response } from "express";
import { RecruiterServices } from "../../services/recruiterServices";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

export class RecruiterControllers {
  // Admin: list all recruiters
  static async getAllRecruiters(req: CustomRequestInterface, res: Response) {
    try {
      const recruiters = await RecruiterServices.getAll();
      return res.status(200).json({ success: true, data: recruiters });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: get all pending (unverified) recruiters — shown in admin dashboard
  static async getPendingRecruiters(req: CustomRequestInterface, res: Response) {
    try {
      const pending = await RecruiterServices.getPending();
      return res.status(200).json({
        success: true,
        message: `${pending.length} recruiter(s) awaiting verification`,
        data: pending,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: get all verified recruiters
  static async getVerifiedRecruiters(req: CustomRequestInterface, res: Response) {
    try {
      const verified = await RecruiterServices.getVerified();
      return res.status(200).json({ success: true, data: verified });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: approve a recruiter — sets isVerified = true
  static async approveRecruiter(req: CustomRequestInterface, res: Response) {
    try {
      const recruiter = await RecruiterServices.verify(Number(req.params.id));
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
      return res.status(200).json({
        success: true,
        message: `Recruiter ${(recruiter as any).firstName} ${(recruiter as any).lastName} has been approved and can now login.`,
        data: { id: (recruiter as any).id, isVerified: true },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: reject a recruiter — deletes their record
  static async rejectRecruiter(req: CustomRequestInterface, res: Response) {
    try {
      const recruiter = await RecruiterServices.findById(Number(req.params.id));
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
      await RecruiterServices.delete(Number(req.params.id));
      return res.status(200).json({
        success: true,
        message: `Recruiter application has been rejected and removed.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: get specific recruiter by id
  static async getRecruiterById(req: CustomRequestInterface, res: Response) {
    try {
      const recruiter = await RecruiterServices.findById(Number(req.params.id));
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
      return res.status(200).json({ success: true, data: recruiter });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Admin: delete a recruiter
  static async deleteRecruiter(req: CustomRequestInterface, res: Response) {
    try {
      const recruiter = await RecruiterServices.findById(Number(req.params.id));
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
      await RecruiterServices.delete(Number(req.params.id));
      return res.status(200).json({ success: true, message: "Recruiter deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Recruiter: view own profile
  static async getMyProfile(req: CustomRequestInterface, res: Response) {
    try {
      const recruiter = await RecruiterServices.findById(req.user.recruiterId!);
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
      const { password: _, ...safeData } = recruiter as any;
      return res.status(200).json({ success: true, data: safeData });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Recruiter: update own profile
  static async updateMyProfile(req: CustomRequestInterface, res: Response) {
    try {
      const updated = await RecruiterServices.update(req.user.recruiterId!, req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Recruiter not found" });
      return res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Recruiter: view all applications for their posted jobs
  static async viewApplications(req: CustomRequestInterface, res: Response) {
    try {
      const applications = await RecruiterServices.getApplicationsForRecruiter(req.user.recruiterId!);
      return res.status(200).json({ success: true, message: `Found ${applications.length} applications`, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Recruiter: view all interviews they scheduled
  static async viewInterviews(req: CustomRequestInterface, res: Response) {
    try {
      const interviews = await RecruiterServices.getInterviewsForRecruiter(req.user.recruiterId!);
      return res.status(200).json({ success: true, message: `Found ${interviews.length} interviews`, data: interviews });
    } catch (error) {
      return res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}
