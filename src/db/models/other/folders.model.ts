import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const Folder = sequelize.define("Folder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  folderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Folder;
