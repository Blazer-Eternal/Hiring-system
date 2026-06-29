import * as Sequelize from "sequelize";

export interface InputUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface UserInterface extends InputUserInterface {
  id: number;
}

export interface UserModelInterface
  extends Sequelize.Model<UserInterface, Partial<InputUserInterface>>,
    UserInterface {}
