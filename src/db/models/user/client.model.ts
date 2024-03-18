import { sequelize } from "../../instance";

import { DataTypes } from "sequelize";

const Client = sequelize.define("Client", {
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

export default Client;
