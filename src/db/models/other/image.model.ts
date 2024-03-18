import { DataTypes } from "sequelize";
import { sequelize } from "../../instance";

const Image = sequelize.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  urldata: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default Image;
