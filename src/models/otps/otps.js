import { DataTypes } from "sequelize";
import sequelize from "../../loaders/connection.js";

const Otps = sequelize.define('Otps', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  otp: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  expiredTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'otps',
});

export default Otps;
