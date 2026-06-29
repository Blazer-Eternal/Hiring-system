import * as Sequelize from "sequelize";
import { Database } from "../config";
import { UserModelInterface } from "../interfaces/userInterface";

interface SequelizeWithQueryTypes extends Sequelize.Sequelize {
  QueryTypes: typeof Sequelize.QueryTypes;
}

const sequelize = Database.sequelize as SequelizeWithQueryTypes;

const Users = sequelize.define<UserModelInterface>("Users", {
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
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false,
});

export const db = { Users, sequelize };
export default Users;

// the recruiter table is not needed. the
//  functionality for the recruiter signup can be done 
//  through the users table by checking the role .i.e role=="recruiter"
