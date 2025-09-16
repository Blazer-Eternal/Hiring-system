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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    skills: {
    type: Sequelize.STRING,
    allowNull: false,
    },
    experience: {
      type: Sequelize.FLOAT,
      allowNull: false,     
    },
 
  },
  {
  timestamps: false,
  
  }
);

export default Candidates;