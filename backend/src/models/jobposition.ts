import * as Sequelize from "sequelize";
import { Database } from "../config";
import { JobModelInterface } from "../interfaces/jobPositionInterface";
import { JobStatusEnum } from "../enums/jobStatusEnum";

const sequelize = Database.sequelize;

const JobPositions = sequelize.define<JobModelInterface>(
    "JobPositions",
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        requirements: {
            type: Sequelize.STRING,
            allowNull: false
        },
        department: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        salaryRange: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM(JobStatusEnum.OPEN, JobStatusEnum.CLOSED),
            allowNull: false,
            defaultValue: JobStatusEnum.OPEN,
        },
    },
    {
        timestamps: false
    }
);

export default JobPositions;