import * as Sequelize from "sequelize";

export interface InputCandidateInterface {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
}

export interface CandidateInterface extends InputCandidateInterface {
  id: number;

}

export interface CandidateModelInterface
  extends Sequelize.Model<CandidateInterface, Partial<InputCandidateInterface>>,
    CandidateInterface {}