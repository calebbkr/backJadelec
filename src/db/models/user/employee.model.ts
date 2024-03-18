import { sequelize } from "../../instance";

import { DataTypes } from "sequelize";

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

export default Employee;
