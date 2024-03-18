import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const Repertoire = sequelize.define("Repertoire", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Repertoire;
