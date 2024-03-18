import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";
import Permission from "./permissions.model";
import User from "./admin.model";

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

export default Group;
