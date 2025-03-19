import { authService } from "../../services/index.js";
import {successHandler} from '../../utils/index.js'
import { validateUser } from "../../validations/userValidations.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and Password are required',
                status: false,
                success: false,
            });
        }
        const response = await authService.loginUser(email, password);
        if (!response.success) {
            return res.status(404).json({
                message: response.message,
                status: false,
                success: false,
            });
        }
        const data = {
            id: response.userData[0].id,
            name: response.userData[0].name,
            email: response.userData[0].email,
            phone: response.userData[0].phone,
            roleId: response.userData[0].role_id,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        }
        successHandler(res, 200, 'User logged in successfully', data);
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ 
            message: 'Error logging in user', 
            status: false, 
            success: false, 
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, phone, password, roleId } = req.body;
        const validation = validateUser(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.message,
                status: false,
                success: false,
            });
        }
        if (roleId === 1) {
            return res.status(400).json({
                message: `RoleId 1 is not assignable`,
                status: false,
                success: false,
            });
        }

        const existingUser = await authService.findUserExists(email, phone);
        if (existingUser?.email || existingUser?.phone) {
            return res.status(400).json({
                message: `User already exists`,
                status: false,
                success: false,
            });
        }
        const user = await authService.register(name, email, phone, password, roleId);
        successHandler(res, 201, 'User created successfully', null);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ 
            message: 'Error creating user', 
            status: false, 
            success: false, 
            error: error.message 
        });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                status: false,
                success: false,
            });
        }
        const response = await authService.sendOtp(email);
        if (!response.success) {
            return res.status(404).json({
                message: response.message,
                status: false,
                success: false,
            });
        }
        let data = null
        successHandler(res, 200, 'OTP sent successfully to your email', data);
    } catch (error) {
        console.error('Error sending otp:', error.message);
        res.status(500).json({ 
            message: 'Error sending otp', 
            status: false, 
            success: false, 
            error: error.message 
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                status: false,
                success: false,
            });
        }
        if (!otp) {
            return res.status(400).json({
                message: 'OTP is required',
                status: false,
                success: false,
            });
        }
        const response = await authService.verifyOtp(email, otp);
        if (!response.success) {
            return res.status(403).json({
                message: response.message,
                status: false,
                success: false,
            });
        }
        const data = {
            id: response.userData[0].id,
            name: response.userData[0].name,
            email: response.userData[0].email,
            phone: response.userData[0].phone,
            roleId: response.userData[0].role_id,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        }
        successHandler(res, 200, 'User logged in successfully', data);
    } catch (error) {
        console.error('Error verifing otp:', error.message);
        res.status(500).json({ 
            message: 'Error verifing otp', 
            status: false, 
            success: false, 
            error: error.message 
        });
    }
};