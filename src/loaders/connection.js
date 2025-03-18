import Sequelize from 'sequelize'
import { dbHost, dbName, dbUser, dbPass } from '../config/index.js';

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost, 
  dialect: 'mysql', 
  pool: {
    max: 10,
    min: 0, 
    acquire: 30000, 
    idle: 10000 
  }
});


export default sequelize;
