import * as Sequelize from "sequelize";
import { Database } from "../config";
import { UserModelInterface } from "../interfaces/userInterface";
import { RoleEnum } from "../enums/roleEnum";

// Solution: Properly type your sequelize instance
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
  name: {
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
    type: Sequelize.ENUM(RoleEnum.admin, RoleEnum.user),
    allowNull: false,
    defaultValue: RoleEnum.user, 
  },
}, {
  timestamps: false,
});

// Export both the model and the typed sequelize instance
export const db = {
  Users,
  sequelize
};

export default Users;