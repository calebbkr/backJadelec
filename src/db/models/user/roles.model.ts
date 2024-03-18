import { sequelize } from "../../instance";
import User from "./admin.model";
import { DataTypes } from "sequelize";

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Role;
