import { InputApplicationInterface, ApplicationInterface } from "../interfaces/applicationInterface";
import Models from "../models";

export class ApplicationServices {
    public async findAll(filters?: Partial<ApplicationInterface>): Promise<ApplicationInterface[]> {
        const applications = await Models.Applications.findAll({
            where: filters
        });
        return applications;
    }

    public async findById(id: number): Promise<ApplicationInterface | null> {
        const application = await Models.Applications.findByPk(id);
        return application;
    }

    public async create(data: InputApplicationInterface): Promise<ApplicationInterface> {
        const application = await Models.Applications.create(data);
        return application;
    }

    public async update(id: number, data: Partial<InputApplicationInterface>): Promise<boolean> {
        const [updated] = await Models.Applications.update(data, {
            where: { id },
        });
        return updated === 1;
    }

    public async delete(id: number): Promise<boolean> {
        const deleted = await Models.Applications.destroy({
            where: { id },
        });
        return deleted > 0;
    }

    public async findByJobId(jobId: number): Promise<ApplicationInterface[]> {
        const applications = await Models.Applications.findAll({
            where: { jobId },
        });
        return applications;
    }

    public async findByCandidateId(candidateId: number): Promise<ApplicationInterface[]> {
        const applications = await Models.Applications.findAll({
            where: { candidateId },
        });
        return applications;
    }

        public async findbyInterviewId(interviewId: number): Promise<ApplicationInterface[]> {
        const applications = await Models.Applications.findAll({
            where: { interviewId },
        });
        return applications;
    }
}