import * as Sequelize from "sequelize";
import { ApplicationStatusEnum } from "../enums/applicationStatusEnum";

export interface InputApplicationInterface {
  candidateId: number;
  jobId: number;
  interviewId: number;
  status?: ApplicationStatusEnum;
}

export interface ApplicationInterface extends InputApplicationInterface {
  id: number;
  createdAt: Date;
  updatedAt: Date;

}

export interface ApplicationModelInterface
  extends Sequelize.Model<ApplicationInterface, Partial<InputApplicationInterface>>,
    ApplicationInterface {}