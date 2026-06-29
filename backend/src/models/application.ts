import * as Sequelize from "sequelize";
import { Database } from "../config";
import { ApplicationModelInterface } from "../interfaces/applicationInterface";
import { ApplicationStatusEnum } from "../enums/applicationStatusEnum";

const sequelize = Database.sequelize;

const Applications = sequelize.define<ApplicationModelInterface>(
  "Applications",
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
    jobId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "JobPositions",
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    interviewId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Interviews",
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: Sequelize.ENUM(
        ApplicationStatusEnum.APPLIED,
        ApplicationStatusEnum.UNDER_REVIEW,
        ApplicationStatusEnum.INTERVIEW,
        ApplicationStatusEnum.HIRED,
        ApplicationStatusEnum.REJECTED
      ),
      allowNull: false,
      defaultValue: ApplicationStatusEnum.APPLIED,
    },
    matchScore: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
      comment: 'TF-IDF cosine similarity score (0-100) between CV and job description',
    },
    matchedKeywords: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
      comment: 'Keywords matched between candidate CV and job requirements',
    },
    cvSnapshot: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: 'CV text captured at time of application for word matching',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, 
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, 
    },
  },
  {
    timestamps: true, 
  }
);

export default Applications;
