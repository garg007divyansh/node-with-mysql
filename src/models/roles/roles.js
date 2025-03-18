import { DataTypes } from "sequelize";
import sequelize from "../../loaders/connection.js";

const Roles = sequelize.define('Roles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'roles',
});

export default Roles;
