import { InputInterviewInterface, InterviewInterface } from "../interfaces/interviewInterface";
import Models from "../models";

export class InterviewServices {
    public async findAll(): Promise<InterviewInterface[]> {
        return await Models.Interviews.findAll();
    }

    public async findById(id: number): Promise<InterviewInterface | null> {
        return await Models.Interviews.findByPk(id);
    }

    public async create(data: InputInterviewInterface): Promise<InterviewInterface> {
        return await Models.Interviews.create(data);
    }

    public async update(id: number, data: Partial<InputInterviewInterface>): Promise<boolean> {
        const [updated] = await Models.Interviews.update(data, { where: { id } });
        return updated === 1;
    }


    public async updateFeedback(id: number, feedback: string, rating?: number): Promise<boolean> {
        const updateData: Partial<InputInterviewInterface> = { feedback };
        if (rating) updateData.rating = rating;
        const [updated] = await Models.Interviews.update(updateData, { where: { id } });
        return updated === 1;
    }

//     public async findByApplicationId(applicationId: number): Promise<InterviewInterface[]> {
//         // return await Models.Interviews.findAll({ where: { applicationId } });
//     }
}