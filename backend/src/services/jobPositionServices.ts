import { InputJobInterface, JobPositionInterface } from "../interfaces/jobPositionInterface";
import { JobStatusEnum } from "../enums/jobStatusEnum";
import Models from "../models";

export class JobServices {
  public async findAll(filters?: { status?: JobStatusEnum; recruiterId?: number }): Promise<JobPositionInterface[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.recruiterId) where.recruiterId = filters.recruiterId;
    return await Models.JobPositions.findAll({ where });
  }

  public async findById(id: number): Promise<JobPositionInterface | null> {
    return await Models.JobPositions.findByPk(id, {
      include: [{ model: Models.Users, as: 'Recruiter', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });
  }

  public async create(data: InputJobInterface): Promise<JobPositionInterface> {
    return await Models.JobPositions.create(data);
  }

  public async update(id: number, data: Partial<InputJobInterface>): Promise<boolean> {
    const [updated] = await Models.JobPositions.update(data, { where: { id } });
    return updated > 0;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await Models.JobPositions.destroy({ where: { id } });
    return deleted > 0;
  }

  public async findByRecruiterId(recruiterId: number): Promise<JobPositionInterface[]> {
    return await Models.JobPositions.findAll({ where: { recruiterId } });
  }
}
