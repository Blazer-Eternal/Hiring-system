import * as Sequelize from "sequelize";
import { Database } from "../config";
import { InterviewModelInterface } from "../interfaces/interviewInterface";
import { InterviewStatusEnum } from "../enums/interviewStatusEnum";

const sequelize = Database.sequelize;

const Interviews = sequelize.define<InterviewModelInterface>(
  "Interviews",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    applicationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Applications", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    candidateId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Candidates", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    recruiterId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Recruiters", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    scheduleDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 15, max: 60 },
    },
    status: {
      type: Sequelize.ENUM(
        InterviewStatusEnum.SCHEDULED,
        InterviewStatusEnum.COMPLETED,
        InterviewStatusEnum.CANCELLED
      ),
      allowNull: false,
      defaultValue: InterviewStatusEnum.SCHEDULED,
    },
    feedback: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
  },
  { timestamps: true }
);

export default Interviews;
