import expressLoader from './express.js';
import sequelize from './connection.js';

export default async (app) => {
    try {
        await sequelize.authenticate();
        expressLoader(app);
    } catch (err) {
        console.log(err);
    }
}