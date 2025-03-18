import sequelize from "../../loaders/connection.js";
import { QueryTypes } from "sequelize";

export const getAllRoles = async () => {
    try {
        let rolesData = await sequelize.query('select * from roles', { type: QueryTypes.SELECT });
        return rolesData;
    } catch (error) {
        throw new Error('Error fetching roles: ' + error.message);
    }
};
