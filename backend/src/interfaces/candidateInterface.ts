import * as Sequelize from "sequelize";

export interface InputCandidateInterface {
  userId: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  temporaryAddress?: string;
  permanentAddress?: string;
  cvUrl?: string;
}

export interface CandidateInterface extends InputCandidateInterface {
  id: number;
}

export interface CandidateModelInterface
  extends Sequelize.Model<CandidateInterface, Partial<InputCandidateInterface>>,
    CandidateInterface {}