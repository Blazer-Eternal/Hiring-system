import { InputJobInterface, JobPositionInterface } from "../interfaces/jobPositionInterface";
import Models from "../models";

export class JobServices {
  public async findAll(): Promise<JobPositionInterface[]> {
    const data = await Models.JobPositions.findAll();
    return data;
  }

  public async findById(id: number): Promise<JobPositionInterface | null> {
    const job = await Models.JobPositions.findByPk(id);
    return job;
  }

  public async create(data: InputJobInterface): Promise<JobPositionInterface> {
    const job = await Models.JobPositions.create(data);
    return job;
  }

  public async update(id: number, data: Partial<InputJobInterface>): Promise<boolean> {
    const update = await Models.JobPositions.update(data, {
      where: {
        id: id,
      },
    });
    return update[0] === 0 ? false : true;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await Models.JobPositions.destroy({
      where: {
        id: id,
      },
    });
    return deleted > 0;
  }
}