import { Response } from "express";
import { InterviewServices } from "../../services/interviewServices";
import { InterviewStatusEnum } from "../../enums/interviewStatusEnum";
import { ApplicationStatusEnum } from "../../enums";
import { CustomRequestInterface } from "../../interfaces";
import Models from "../../models";

export class InterviewController {
  // Recruiter: schedule interview — recruiterId from JWT
  public static async scheduleInterview(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      const { applicationId, scheduleDate, duration } = req.body;

      const application = await Models.Applications.findByPk(applicationId);
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      const job = await Models.JobPositions.findByPk((application as any).jobId);
      if (!job || (job as any).recruiterId !== req.user.recruiterId) {
        return res.status(403).json({ success: false, message: "Access denied. This application is not for your job." });
      }

      const candidateId = (application as any).candidateId;

      const interview = await new InterviewServices().create({
        applicationId,
        candidateId,
        recruiterId: req.user.recruiterId!,
        scheduleDate,
        duration,
      });

      await Models.Applications.update(
        { status: ApplicationStatusEnum.INTERVIEW, interviewId: interview.id },
        { where: { id: applicationId } }
      );

      return res.status(201).json({ success: true, message: "Interview scheduled successfully", data: interview });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: all; Recruiter: own; Candidate: own
  public static async getAllInterviews(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      let interviews;
      if (req.user.role === 'admin') {
        interviews = await Models.Interviews.findAll({
          include: [
            { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber'] },
            { model: Models.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
            {
              model: Models.Applications, as: 'Application',
              attributes: ['id', 'status'],
              include: [{ model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department'] }],
            },
          ],
          order: [['scheduleDate', 'ASC']],
        });
      } else if (req.user.role === 'recruiter') {
        interviews = await Models.Interviews.findAll({
          where: { recruiterId: req.user.recruiterId },
          include: [
            { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
            {
              model: Models.Applications, as: 'Application',
              attributes: ['id', 'status'],
              include: [{ model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department'] }],
            },
          ],
          order: [['scheduleDate', 'ASC']],
        });
      } else {
        const candidate = await Models.Candidates.findOne({ where: { userId: req.user.userId } });
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate profile not found" });
        interviews = await Models.Interviews.findAll({
          where: { candidateId: candidate.id },
          include: [
            { model: Models.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
            {
              model: Models.Applications, as: 'Application',
              attributes: ['id', 'status'],
              include: [{ model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] }],
            },
          ],
          order: [['scheduleDate', 'ASC']],
        });
      }
      return res.status(200).json({ success: true, data: interviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async getInterviewDetails(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const interview = await Models.Interviews.findByPk(Number(id), {
        include: [
          { model: Models.Candidates, as: 'Candidate', attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'] },
          { model: Models.Recruiters, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] },
          {
            model: Models.Applications, as: 'Application',
            attributes: ['id', 'status'],
            include: [{ model: Models.JobPositions, as: 'Job', attributes: ['id', 'title', 'department', 'location'] }],
          },
        ],
      });
      if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
      return res.status(200).json({ success: true, data: interview });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async updateInterview(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      if (req.user.role === 'recruiter') {
        const interview = await Models.Interviews.findByPk(Number(id));
        if (!interview || (interview as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }
      const isUpdated = await new InterviewServices().update(Number(id), req.body);
      if (!isUpdated) return res.status(404).json({ success: false, message: "Interview not found" });
      return res.status(200).json({ success: true, message: "Interview updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async updateInterviewStatus(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body;
    try {
      if (!Object.values(InterviewStatusEnum).includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
      if (req.user.role === 'recruiter') {
        const interview = await Models.Interviews.findByPk(Number(id));
        if (!interview || (interview as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }
      const isUpdated = await new InterviewServices().update(Number(id), { status });
      if (!isUpdated) return res.status(404).json({ success: false, message: "Interview not found" });
      return res.status(200).json({ success: true, message: "Interview status updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async updateInterviewFeedback(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { id } = req.params;
    const { feedback, rating } = req.body;
    try {
      if (!feedback) return res.status(400).json({ success: false, message: "Feedback is required" });
      if (req.user.role === 'recruiter') {
        const interview = await Models.Interviews.findByPk(Number(id));
        if (!interview || (interview as any).recruiterId !== req.user.recruiterId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }
      const isUpdated = await new InterviewServices().updateFeedback(Number(id), feedback, rating);
      if (!isUpdated) return res.status(404).json({ success: false, message: "Interview not found" });
      return res.status(200).json({ success: true, message: "Interview feedback updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
