import * as Sequelize from "sequelize";
import { InterviewStatusEnum } from "../enums/interviewStatusEnum";

export interface InputInterviewInterface {
    candidateId: number;
    scheduleDate: Date;
    duration: number;
    status?: InterviewStatusEnum;
    feedback?: string;
    rating?: number;
}

export interface InterviewInterface extends InputInterviewInterface {
    id: number;
   
}

export interface InterviewModelInterface
    extends Sequelize.Model<InterviewInterface, Partial<InputInterviewInterface>>,
        InterviewInterface {}