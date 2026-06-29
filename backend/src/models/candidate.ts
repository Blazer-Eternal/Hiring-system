import * as Sequelize from "sequelize";
import { Database } from "../config";
import { CandidateModelInterface } from "../interfaces/candidateInterface";

const sequelize = Database.sequelize;

const Candidates = sequelize.define<CandidateModelInterface>(
  "Candidates",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,   // optional on update
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,   // optional on update, no unique — email lives in Users
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: true,   // optional on update
    },
    temporaryAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    permanentAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cvUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Candidates;
