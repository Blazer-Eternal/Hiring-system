import * as Sequelize from "sequelize";
import { Database } from "../config";
import { RecruiterModelInterface } from "../interfaces/recruiterInterface";

const sequelize = Database.sequelize;

const Recruiters = sequelize.define<RecruiterModelInterface>("Recruiters", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,   // track when they signed up and when verified
});

export default Recruiters;
