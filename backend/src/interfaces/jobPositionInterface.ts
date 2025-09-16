import * as Sequelize from "sequelize";
import { JobStatusEnum } from "../enums/jobStatusEnum";

export interface InputJobInterface {
  title: string;
  description: string;
  requirements: string;
  department: string;
  location: string;
  salaryRange: string;
  status?: JobStatusEnum;
}

export interface JobPositionInterface extends InputJobInterface {
  id: number;
}

export interface JobModelInterface
  extends Sequelize.Model<JobPositionInterface, Partial<InputJobInterface>>,
    JobPositionInterface {}