import { InputCandidateInterface, CandidateInterface } from "../interfaces/candidateInterface";
import Models from "../models";

export class CandidateServices {
  public async findAll(): Promise<CandidateInterface[]> {
    const data = await Models.Candidates.findAll();
    return data;
  }

  public async findById(id: number): Promise<CandidateInterface | null> {
    const candidate = await Models.Candidates.findByPk(id);
    return candidate;
  }

  public async create(data: InputCandidateInterface): Promise<CandidateInterface> {
    const candidate = await Models.Candidates.create(data);
    return candidate;
  }

  public async update(id: number, data: Partial<InputCandidateInterface>): Promise<boolean> {
    const update = await Models.Candidates.update(data, {
      where: {
        id: id,
      },
    });
    return update[0] === 0 ? false : true;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await Models.Candidates.destroy({
      where: {
        id: id,
      },
    });
    return deleted > 0;
  }
}