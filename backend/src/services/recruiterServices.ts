import Models from "../models";
import { InputRecruiterInterface, RecruiterInterface } from "../interfaces/recruiterInterface";

export class RecruiterServices {
  static async create(data: InputRecruiterInterface): Promise<RecruiterInterface> {
    return await Models.Recruiters.create(data as any);
  }

  static async findByEmail(email: string): Promise<RecruiterInterface | null> {
    return await Models.Recruiters.findOne({ where: { email } });
  }

  static async findById(id: number): Promise<RecruiterInterface | null> {
    return await Models.Recruiters.findByPk(id);
  }

  static async getAll(): Promise<RecruiterInterface[]> {
    return await Models.Recruiters.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified'],
    });
  }

  static async update(id: number, data: Partial<InputRecruiterInterface>): Promise<RecruiterInterface | null> {
    const recruiter = await Models.Recruiters.findByPk(id);
    if (!recruiter) return null;
    return await recruiter.update(data);
  }

  static async delete(id: number): Promise<void> {
    await Models.Recruiters.destroy({ where: { id } });
  }

  // Admin: approve a recruiter — sets isVerified = true
  static async verify(id: number): Promise<RecruiterInterface | null> {
    const recruiter = await Models.Recruiters.findByPk(id);
    if (!recruiter) return null;
    return await recruiter.update({ isVerified: true });
  }

  // Admin: get all pending (unverified) recruiters
  static async getPending(): Promise<RecruiterInterface[]> {
    return await Models.Recruiters.findAll({
      where: { isVerified: false },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified', 'createdAt'],
    });
  }

  // Admin: get all verified recruiters
  static async getVerified(): Promise<RecruiterInterface[]> {
    return await Models.Recruiters.findAll({
      where: { isVerified: true },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'location', 'isVerified', 'createdAt'],
    });
  }

  // Applications for jobs posted by this recruiter
  static async getApplicationsForRecruiter(recruiterId: number) {
    const jobs = await Models.JobPositions.findAll({ where: { recruiterId } });
    const jobIds = jobs.map((j: any) => j.id);
    if (jobIds.length === 0) return [];

    return await Models.Applications.findAll({
      where: { jobId: jobIds },
      include: [
        {
          model: Models.Candidates,
          as: 'Candidate',
          attributes: ['id', 'name', 'email', 'phoneNumber', 'temporaryAddress', 'permanentAddress', 'cvUrl'],
        },
        {
          model: Models.JobPositions,
          as: 'Job',
          attributes: ['id', 'title', 'department', 'location', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Interviews scheduled by this recruiter
  static async getInterviewsForRecruiter(recruiterId: number) {
    return await Models.Interviews.findAll({
      where: { recruiterId },
      include: [
        {
          model: Models.Candidates,
          as: 'Candidate',
          attributes: ['id', 'name', 'email', 'phoneNumber', 'cvUrl'],
        },
        {
          model: Models.Applications,
          as: 'Application',
          attributes: ['id', 'status', 'createdAt'],
          include: [
            {
              model: Models.JobPositions,
              as: 'Job',
              attributes: ['id', 'title', 'department', 'location'],
            },
          ],
        },
      ],
      order: [['scheduleDate', 'ASC']],
    });
  }
}
