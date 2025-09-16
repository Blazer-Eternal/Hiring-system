import * as Sequelize from "sequelize";
import { Database } from "../config";
import { InterviewModelInterface } from "../interfaces/interviewInterface";
import { InterviewStatusEnum } from "../enums/interviewStatusEnum";
import { attachInterviewHooks } from "../hooks/interviewHooks"; 

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
    candidateId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Candidates",
        key: "id",
      },
    },
    scheduleDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 15,
        max: 60,
      },
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
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    timestamps: false,
  }
);

//  attach hooks after model definition
attachInterviewHooks(Interviews);

export default Interviews;
