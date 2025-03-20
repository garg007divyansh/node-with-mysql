import sequelize from "../../loaders/connection.js";
import { QueryTypes } from "sequelize";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/generateToken.js";
import moment from "moment";
import { sendMail } from "../../utils/emailService.js";

export const loginUser = async (email, password) => {
    try {
        let userData = await sequelize.query(`select * from users where email = ? or password = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email, password]
        });
        if (userData.length === 0) {
            return { success: false, message: 'User not found' };
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, userData[0].password);
        if (!isPasswordValid) {
            return { success: false, message: 'Incorrect password' };
        }

        const payload = {
            id: userData[0].id,
            name: userData[0].name,
            email: userData[0].email,
            phone: userData[0].phone,
            roleId: userData[0].role_id,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return { userData, accessToken, refreshToken, success: true };
    } catch (error) {
        throw new Error('Error login user: ' + error.message);
    }
};

export const register = async (name, email, phone, password, roleId) => {
    try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        let userData = await sequelize.query(`insert into users 
        (role_id, name, email, phone, password)
        values (?, ?, ?, ?, ?)`, {
            type: QueryTypes.INSERT,
            replacements: [roleId, name, email, phone, password]
        });
        return userData;
    } catch (error) {
        throw new Error('Error creating users: ' + error.message);
    }
};

export const sendOtp = async (email) => {
    try {
        let userData = await sequelize.query(`select * from users where email = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email]
        });
        if (userData.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const userId = userData[0].id;
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Check if an unverified OTP already exists for the user
        let existingOtp = await sequelize.query(`select * from otps where user_id = ? and is_verified = ?`, {
            type: QueryTypes.SELECT,
            replacements: [userId, false]
        });
        const expiredTime = moment().add(2, 'minutes').toDate();
        if (existingOtp.length > 0) {
            // Update the existing OTP record
            await sequelize.query(
                `update otps set otp = ?, expired_time = ? where user_id = ? and is_verified = ?`,
                {
                    type: QueryTypes.UPDATE,
                    replacements: [otp, expiredTime, userId, false]
                }
            );
        } else {
            // Insert a new OTP record
            await sequelize.query(
                `insert into otps (user_id, otp, is_verified, expired_time) values (?, ?, ?, ?)`,
                {
                    type: QueryTypes.INSERT,
                    replacements: [userId, otp, false, expiredTime]
                }
            );
        }

        // Send OTP via email (common for both cases)
        const emailSubject = 'Your OTP Code';
        const emailText = `Dear ${userData[0].name},\n\nYour OTP code is ${otp}. Please use this code to verify your account.\n\nThank you!`;
        await sendMail(email, emailSubject, emailText);

        return { success: true };
    } catch (error) {
        throw new Error('Error sending OTP: ' + error.message);
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        let userData = await sequelize.query(`select * from users where email = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email]
        });
        if (userData.length === 0) {
            return { success: false, message: 'User not found' };
        }
        const userId = userData[0].id;
        let otpData = await sequelize.query(`select * from otps where user_id = ? and is_verified = ?`, {
            type: QueryTypes.SELECT,
            replacements: [userId, false]
        })
        const expiredTime = moment.utc(otpData[0].expired_time).format('YYYY-MM-DD HH:mm:ss');
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        
        if (otpData.length === 0) {
            return { success: false, message: 'OTP not found' };
        } else if (otpData[0].otp !== otp) {
            return { success: false, message: 'OTP Mismatched' };
        } else if (moment(currentTime).isAfter(expiredTime)) {
            return { success: false, message: 'OTP Expired' };
        } else {
            await sequelize.query(`update otps set is_verified = ? where user_id = ?`, {
                type: QueryTypes.UPDATE,
                replacements: [true, userId]
            });
            const payload = {
                id: userData[0].id,
                name: userData[0].name,
                email: userData[0].email,
                phone: userData[0].phone,
                roleId: userData[0].role_id,
            };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            return { userData, accessToken, refreshToken, success: true };
        }
    } catch (error) {
        throw new Error('Error sending OTP: ' + error.message);
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        // Verify the refresh token
        const payload = verifyToken(refreshToken, process.env.JWT_SECRET_KEY);

        if (!payload) {
            return {
                success: false,
                message: 'Invalid or expired refresh token',
            };
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            roleId: payload.roleId,
        });

        return {
            success: true,
            accessToken: newAccessToken,
        };
    } catch (error) {
        throw new Error('Error processing refresh token: ' + error.message);
    }
};

export const findUserExists = async (email, phone) => {
    try {
        let userData = await sequelize.query(`select * from users where email = ? or phone = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email, phone]
        });
        return userData[0];
    } catch (error) {
        throw new Error('Error checking users: ' + error.message);
    }
};