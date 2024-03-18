import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const EmployeeGroup = sequelize.define("EmployeeGroup", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default EmployeeGroup;
