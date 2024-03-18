import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const Permission = sequelize.define("Permission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  readAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  writeAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deleteAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Permission;
