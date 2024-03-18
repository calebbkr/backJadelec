import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const File = sequelize.define("File", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  urlData: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validation: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default File;
