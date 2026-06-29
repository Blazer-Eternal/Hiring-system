import * as Sequelize from "sequelize";
import { ApplicationStatusEnum } from "../enums/applicationStatusEnum";

export interface InputApplicationInterface {
  candidateId: number;
  jobId: number;
  interviewId?: number | null;
  status?: ApplicationStatusEnum;
  matchScore?: number;          // TF-IDF cosine similarity score 0-100
  matchedKeywords?: string[];   // keywords matched between CV and job
  cvSnapshot?: string;          // CV text at time of application
}

export interface ApplicationInterface extends InputApplicationInterface {
  id: number;
  createdAt: Date;
  updatedAt: Date;

}

export interface ApplicationModelInterface
  extends Sequelize.Model<ApplicationInterface, Partial<InputApplicationInterface>>,
    ApplicationInterface {}