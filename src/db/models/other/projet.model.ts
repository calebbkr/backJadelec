import { DataTypes } from 'sequelize';
import { sequelize } from '../../instance';

const Projet = sequelize.define('Projet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Projet;