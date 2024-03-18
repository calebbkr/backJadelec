import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const FileValidation = sequelize.define("FileValidation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  validatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
    allowNull: false,
  },
});

export default FileValidation;
