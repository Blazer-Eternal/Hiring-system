import { Response } from "express";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

// Algorithms — pure math/data-structures (inside src/api/algorithms)
import {
  rankJobsForCandidate,
  rankCandidatesForJob,
  applicationLSHIndex,
} from "../algorithms";

// AI Features — business-domain AI (inside src/api/ai)
import {
  askChatbot,
  getFAQCategories,
  parseResume,
  buildCandidateProfileText,
  getPersonalizedRecommendations,
  checkProfileCompleteness,
  updatePreferences,
} from "../ai";

export class AIController {
  // ── Chatbot ─────────────────────────────────────────────────────────────────

  /** POST /api/v1/ai/chat — any authenticated user */
  static async chat(req: CustomRequestInterface, res: Response) {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ success: false, message: "question is required" });
      }
      const response = askChatbot(question.trim());
      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /** GET /api/v1/ai/chat/faq — public */
  static async getFAQ(req: CustomRequestInterface, res: Response) {
    try {
      const categories = getFAQCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Resume Parser ───────────────────────────────────────────────────────────

  /** POST /api/v1/ai/resume/parse — user only */
  static async parseResume(req: CustomRequestInterface, res: Response) {
    try {
      const { rawText } = req.body;
      if (!rawText || typeof rawText !== 'string') {
        return res.status(400).json({ success: false, message: "rawText is required" });
      }
      const parsed = parseResume(rawText);
      return res.status(200).json({ success: true, data: parsed });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Job Matching — TF-IDF + Cosine Similarity O(n x m) ─────────────────────

  /** GET /api/v1/ai/jobs/match — user: ranked open jobs for their profile */
  static async matchJobsForCandidate(req: CustomRequestInterface, res: Response) {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate profile not found" });
      }

      const jobs = await Models.JobPositions.findAll({ where: { status: 'open' } });
      if (jobs.length === 0) return res.status(200).json({ success: true, data: [] });

      const profileText = buildCandidateProfileText({
        name: (candidate as any).name,
        temporaryAddress: (candidate as any).temporaryAddress,
        permanentAddress: (candidate as any).permanentAddress,
      });

      const ranked = rankJobsForCandidate(
        profileText,
        jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          requirements: j.requirements,
        }))
      );

      updatePreferences(candidate.id, { viewedJobIds: ranked.slice(0, 5).map(r => r.jobId) });

      return res.status(200).json({ success: true, data: ranked });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /** GET /api/v1/ai/jobs/:jobId/candidates — recruiter: ranked candidates for a job */
  static async matchCandidatesForJob(req: CustomRequestInterface, res: Response) {
    try {
      const { jobId } = req.params;
      const job = await Models.JobPositions.findByPk(Number(jobId));
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });

      if ((job as any).recruiterId !== req.user.recruiterId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const applications = await Models.Applications.findAll({
        where: { jobId: Number(jobId) },
        include: [{ model: Models.Candidates, as: 'Candidate' }],
      });

      const candidates = applications.map((app: any) => ({
        id: app.Candidate.id,
        name: app.Candidate.name,
        email: app.Candidate.email,
        cvUrl: app.Candidate.cvUrl,
        profileText: buildCandidateProfileText({
          name: app.Candidate.name,
          temporaryAddress: app.Candidate.temporaryAddress,
          permanentAddress: app.Candidate.permanentAddress,
        }),
      }));

      const ranked = rankCandidatesForJob(
        {
          description: (job as any).description,
          requirements: (job as any).requirements,
          title: (job as any).title,
        },
        candidates
      );

      return res.status(200).json({ success: true, data: ranked });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Personalization ─────────────────────────────────────────────────────────

  /** GET /api/v1/ai/recommendations — user: personalized job recommendations */
  static async getRecommendations(req: CustomRequestInterface, res: Response) {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate profile not found" });
      }

      const jobs = await Models.JobPositions.findAll({ where: { status: 'open' } });

      const recommendations = getPersonalizedRecommendations(
        {
          id: candidate.id,
          name: (candidate as any).name,
          temporaryAddress: (candidate as any).temporaryAddress,
          permanentAddress: (candidate as any).permanentAddress,
        },
        jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          requirements: j.requirements,
          department: j.department,
          location: j.location,
          status: j.status,
        }))
      );

      return res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /** GET /api/v1/ai/profile/completeness — user: profile completeness check */
  static async getProfileCompleteness(req: CustomRequestInterface, res: Response) {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate profile not found" });
      }

      const result = checkProfileCompleteness({
        name: (candidate as any).name,
        email: (candidate as any).email,
        phoneNumber: (candidate as any).phoneNumber,
        temporaryAddress: (candidate as any).temporaryAddress,
        permanentAddress: (candidate as any).permanentAddress,
        cvUrl: (candidate as any).cvUrl,
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Duplicate Detection — LSH O(n) ─────────────────────────────────────────

  /** POST /api/v1/ai/applications/duplicates — admin: find near-duplicate applications */
  static async findDuplicateApplications(req: CustomRequestInterface, res: Response) {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ success: false, message: "text is required" });

      const duplicates = applicationLSHIndex.findNearDuplicates({ id: 'query', text });
      return res.status(200).json({ success: true, data: duplicates });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
