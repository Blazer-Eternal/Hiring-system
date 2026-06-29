import * as Sequelize from "sequelize";

export interface InputRecruiterInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
  isVerified?: boolean;
}

export interface RecruiterInterface extends InputRecruiterInterface {
  id: number;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecruiterModelInterface
  extends Sequelize.Model<RecruiterInterface, Partial<InputRecruiterInterface>>,
    RecruiterInterface {}
