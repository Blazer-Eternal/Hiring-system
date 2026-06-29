import { Response } from "express";
import { ApplicationServices } from "../../services/applicationServices";
import { ApplicationStatusEnum } from "../../enums";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

// Algorithms — pure math (Bloom Filter O(1), LSH O(n), TF-IDF O(n×m))
import {
  mightBeDuplicate,
  registerApplication,
  applicationLSHIndex,
  rankCandidatesForJob,
  computeMatch,
} from "../algorithms";

// AI Features — smart notifications, resume parsing
import {
  notifyApplicationReceived,
  notifyStatusChanged,
} from "../ai";

// ── Build rich candidate text from all profile fields ─────────────────────────
// IMPORTANT: Do NOT include address fields — they add location noise (tilottama, kathmandu)
// that pollutes the match score with irrelevant words.
// Only include actual CV/skill content.

function buildRichCandidateText(candidate: any, cvText?: string): string {
  const parts: string[] = [];

  // CV text from request body — highest priority, most relevant
  if (cvText?.trim()) parts.push(cvText.trim());

  // Only include name — NOT address fields (they add location noise)
  if (candidate.name && !cvText?.trim()) parts.push(candidate.name);

  return parts.join(' ').trim();
}

// ─────────────────────────────────────────────────────────────────────────────

export class ApplicationController {

  // ── User: apply for a job ─────────────────────────────────────────────────
  // 1. Bloom Filter O(1) fast duplicate check
  // 2. TF-IDF word matching between CV text and job description
  // 3. Store matchScore + matchedKeywords on the application
  // 4. Register in LSH index for near-duplicate detection
  // 5. Smart notifications

  public static async createApplication(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) {
        return res.status(403).json({ success: false, message: "Candidate profile not found. Please create your profile first." });
      }

      const { jobId, cvText } = req.body;

      const job = await Models.JobPositions.findByPk(jobId);
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      if ((job as any).status !== 'open') {
        return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
      }

      // ── Tier 1: Bloom Filter O(1) fast duplicate rejection ────────────────
      if (mightBeDuplicate(candidate.id, jobId)) {
        const existing = await Models.Applications.findOne({ where: { candidateId: candidate.id, jobId } });
        if (existing) {
          return res.status(409).json({ success: false, message: "You have already applied for this job" });
        }
      }

      // ── CV Word Matching (TF-IDF + Keyword Matching) ─────────────────────
      // Build rich candidate text from all available profile fields + cvText
      const candidateCvText = buildRichCandidateText(candidate, cvText);

      const jobText = [
        (job as any).title,
        (job as any).description,
        (job as any).requirements,
        (job as any).department,
        (job as any).location,
      ].filter(Boolean).join(' ');

      const matchResult = computeMatch(candidateCvText, jobText);
      const { matchScore, matchedKeywords } = matchResult;

      // ── Create Application with match data ────────────────────────────────
      const newApplication = await new ApplicationServices().create({
        candidateId: candidate.id,
        jobId,
        matchScore,
        matchedKeywords,
        cvSnapshot: candidateCvText,
      });

      // ── Register in Bloom Filter + LSH index ──────────────────────────────
      registerApplication(candidate.id, jobId);
      applicationLSHIndex.add({
        id: `application:${newApplication.id}`,
        text: candidateCvText,
      });

      // ── Smart Notifications ───────────────────────────────────────────────
      const recruiterUser = await Models.Users.findByPk((job as any).recruiterId,
        { attributes: ['firstName', 'lastName'] }
      );
      const notifications = notifyApplicationReceived({
        candidateName: (candidate as any).name,
        jobTitle: (job as any).title,
        recruiterName: recruiterUser
          ? `${(recruiterUser as any).firstName} ${(recruiterUser as any).lastName}`.trim()
          : 'Recruiter',
      });

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: {
          id: newApplication.id,
          candidateId: newApplication.candidateId,
          jobId: newApplication.jobId,
          status: newApplication.status,
          matchScore,
          matchedKeywords,
          matchBreakdown: matchResult.breakdown,
          matchSummary: matchScore >= 70
            ? 'Strong match — your profile aligns well with this job'
            : matchScore >= 40
            ? 'Moderate match — consider highlighting relevant experience'
            : matchScore > 0
            ? 'Low match — add more relevant skills to your profile or paste your CV text when applying'
            : 'No CV text provided — paste your CV text when applying to get a match score',
        },
        notifications,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Admin: all; Recruiter: their jobs; User: own ──────────────────────────
  public static async getAllApplications(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      let applications;
      if (req.user.role === 'admin') {
        applications = await Models.Applications.findAll({
          include: [
            { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
            { model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location', 'status'] },
          ],
          order: [['createdAt', 'DESC']],
        });
      } else if (req.user.role === 'recruiter') {
        const jobs = await Models.JobPositions.findAll({ where: { recruiterId: req.user.recruiterId } });
        const jobIds = jobs.map((j: any) => j.id);
        applications = jobIds.length > 0
          ? await Models.Applications.findAll({
              where: { jobId: jobIds },
              include: [
                { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
                { model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] },
              ],
              order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
            })
          : [];
      } else {
        const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
        if (!candidate) return res.status(200).json({ success: true, data: [] });
        applications = await Models.Applications.findAll({
          where: { candidateId: candidate.id },
          include: [
            {
              model: Models.JobPositions, as: 'Job',
              attributes: ['id', 'title', 'department', 'location', 'salaryRange'],
              include: [{ model: Models.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }],
            },
          ],
          order: [['updatedAt', 'DESC']],
        });
      }
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Get single application with match data ────────────────────────────────
  public static async getApplicationById(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const application = await Models.Applications.findByPk(Number(id), {
        include: [
          { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
          { model: Models.JobPositions, as: 'Job' },
        ],
      });
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      if (req.user.role === 'user') {
        const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
        if (!candidate || (application as any).candidateId !== candidate.id) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      } else if (req.user.role === 'recruiter') {
        const job = await Models.JobPositions.findByPk((application as any).jobId);
        if (!job || (job as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }
      return res.status(200).json({ success: true, data: application });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Recruiter/Admin: update application status ────────────────────────────
  public static async updateApplicationStatus(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body;
    try {
      if (!Object.values(ApplicationStatusEnum).includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
      const application = await Models.Applications.findByPk(Number(id));
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      if (req.user.role === 'recruiter') {
        const job = await Models.JobPositions.findByPk((application as any).jobId);
        if (!job || (job as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied. You can only manage applications for your own jobs." });
        }
      }
      await new ApplicationServices().update(Number(id), { status });

      const appWithJob = await Models.Applications.findByPk(Number(id), {
        include: [
          { model: Models.Candidates, as: 'Candidate', attributes: ['name'] },
          { model: Models.JobPositions, as: 'Job', attributes: ['title'] },
        ],
      });
      const notification = notifyStatusChanged({
        candidateName: (appWithJob as any)?.Candidate?.name ?? 'Candidate',
        jobTitle: (appWithJob as any)?.Job?.title ?? 'the job',
        newStatus: status as ApplicationStatusEnum,
      });

      return res.status(200).json({ success: true, message: "Application status updated successfully", notification });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Recruiter: rank candidates for a job by CV match score ────────────────
  // Uses TF-IDF to rank all applicants by how well their CV matches the job
  public static async getRankedCandidatesForJob(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { jobId } = req.params;
    try {
      const job = await Models.JobPositions.findByPk(Number(jobId));
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });

      if (req.user.role === 'recruiter' && (job as any).recruiterId !== req.user.recruiterId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const applications = await Models.Applications.findAll({
        where: { jobId: Number(jobId) },
        include: [{ model: Models.Candidates, as: 'Candidate' }],
        order: [['matchScore', 'DESC']],
      });

      const jobText = `${(job as any).title} ${(job as any).description} ${(job as any).requirements} ${(job as any).department}`;

      const ranked = applications.map((app: any) => {
        // Use stored cvSnapshot first, then fall back to candidate profile fields
        const cvText = app.cvSnapshot?.trim()
          || buildRichCandidateText(app.Candidate);

        const matchResult = app.matchScore !== null && app.matchScore > 0
          ? { matchScore: app.matchScore, matchedKeywords: app.matchedKeywords ?? [], breakdown: null }
          : computeMatch(cvText, jobText);

        return {
          applicationId: app.id,
          candidateId: app.Candidate?.id,
          candidateName: app.Candidate?.name,
          candidateEmail: app.Candidate?.email,
          cvUrl: app.Candidate?.cvUrl,
          applicationStatus: app.status,
          matchScore: matchResult.matchScore,
          matchedKeywords: matchResult.matchedKeywords,
          matchSummary: matchResult.matchScore >= 70 ? 'Strong match'
                      : matchResult.matchScore >= 40 ? 'Moderate match'
                      : 'Low match',
          appliedAt: app.createdAt,
        };
      }).sort((a: any, b: any) => b.matchScore - a.matchScore);

      return res.status(200).json({ success: true, data: ranked });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── User: view own applications with match scores ─────────────────────────
  public static async getMyApplications(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
      if (!candidate) return res.status(200).json({ success: true, data: [] });

      const applications = await Models.Applications.findAll({
        where: { candidateId: candidate.id },
        include: [
          {
            model: Models.JobPositions, as: 'Job',
            attributes: ['id', 'title', 'department', 'location', 'salaryRange', 'status'],
            include: [{ model: Models.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // ── Recruiter/Admin: applications by job ─────────────────────────────────
  public static async getApplicationsByJob(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { jobId } = req.params;
    try {
      if (req.user.role === 'recruiter') {
        const job = await Models.JobPositions.findByPk(Number(jobId));
        if (!job || (job as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }
      const applications = await Models.Applications.findAll({
        where: { jobId: Number(jobId) },
        include: [
          { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
        ],
        order: [['matchScore', 'DESC']],
      });
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async getApplicationsByCandidate(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { candidateId } = req.params;
    try {
      const applications = await new ApplicationServices().findByCandidateId(Number(candidateId));
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async getApplicationsByInterview(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { interviewId } = req.params;
    try {
      const applications = await new ApplicationServices().findbyInterviewId(Number(interviewId));
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
