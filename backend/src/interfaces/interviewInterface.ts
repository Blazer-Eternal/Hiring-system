import * as Sequelize from "sequelize";
import { InterviewStatusEnum } from "../enums/interviewStatusEnum";

export interface InputInterviewInterface {
    applicationId: number;
    candidateId: number;
    recruiterId: number;   // references Users.id where role='recruiter'
    scheduleDate: Date;
    duration: number;
    status?: InterviewStatusEnum;
    feedback?: string;
    rating?: number;
}

export interface InterviewInterface extends InputInterviewInterface {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InterviewModelInterface
    extends Sequelize.Model<InterviewInterface, Partial<InputInterviewInterface>>,
        InterviewInterface {}
