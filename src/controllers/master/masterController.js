import { masterService } from "../../services/index.js";
import {successHandler} from '../../utils/index.js'

export const getAllRoles = async (req, res) => {
    try {
        const roles = await masterService.getAllRoles();
        successHandler(res, 200, 'Roles retrieved successfully', roles);
    } catch (error) {
        console.error('Error Fetching roles:', error.message);
        res.status(500).json({ 
            message: 'Error Fetching roles', 
            status: false, 
            success: false, 
            error: error.message 
        });
    }
};