import { Response } from "express";
import { CandidateServices } from "../../services/candidateServices";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

export class CandidateController {
  // Admin / Recruiter: list all candidates
  public static async getAllCandidates(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const candidates = await new CandidateServices().findAll();
      return res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      console.error('[getAllCandidates] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }

  // Admin / Recruiter: get candidate by ID
  public static async getCandidateById(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const candidate = await new CandidateServices().findById(Number(id));
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }
      return res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      console.error('[getCandidateById] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }

  // User: create own candidate profile — userId auto-set from JWT
  public static async createCandidate(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const existing = await Models.Candidates.findOne({
        where: { userId: req.user.userId },
        include: [{ model: Models.Users, as: 'User', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }]
      });
      if (existing) {
        // Return existing profile — frontend can use it directly
        return res.status(200).json({ success: true, message: "Profile already exists", data: existing });
      }
      const candidateData = { ...req.body, userId: req.user.userId };
      const newCandidate = await new CandidateServices().create(candidateData);
      return res.status(201).json({ success: true, message: "Candidate profile created successfully", data: newCandidate });
    } catch (error) {
      console.error('[createCandidate] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }

  // User: update own profile — find by id first, then verify ownership
  public static async updateCandidate(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    const numericId = Number(id);

    if (!id || isNaN(numericId)) {
      return res.status(400).json({ success: false, message: "Invalid candidate ID" });
    }

    try {
      if (req.user.role === 'user') {
        const candidate = await Models.Candidates.findByPk(numericId);
        if (!candidate) {
          return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        if ((candidate as any).userId !== req.user.userId) {
          return res.status(403).json({ success: false, message: "Access denied. You can only update your own profile." });
        }
      }
      // Strip email and userId — email is unique in DB and must never be updated
      const { email: _email, userId: _userId, ...safeUpdateData } = req.body;
      const updated = await new CandidateServices().update(numericId, safeUpdateData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }
      return res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
    } catch (error) {
      console.error('[updateCandidate] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }

  // Admin only: delete candidate
  public static async deleteCandidate(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const isDeleted = await new CandidateServices().delete(Number(id));
      if (!isDeleted) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }
      return res.status(200).json({ success: true, message: "Candidate deleted successfully" });
    } catch (error) {
      console.error('[deleteCandidate] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }

  // User: view own full profile — returns null if no profile yet
  public static async getMyProfile(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const candidate = await Models.Candidates.findOne({
        where: { userId: req.user.userId },
        include: [{ model: Models.Users, as: 'User', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }]
      });
      if (!candidate) {
        // Return null — frontend shows "create profile" state, not a crash
        return res.status(200).json({ success: true, data: null });
      }
      return res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      console.error('[getMyProfile] Error:', error);
      return res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }
}
