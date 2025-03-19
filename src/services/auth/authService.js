import sequelize from "../../loaders/connection.js";
import { QueryTypes } from "sequelize";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
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
    console.log(email, 'eeeeee');
    try {
        let userData = await sequelize.query(`select * from users where email = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email]
        });
        if (userData.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const userId = userData[0].id;
        const expiredTime = moment().utc().add(2, 'minutes').toDate();
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Check if an unverified OTP already exists for the user
        let existingOtp = await sequelize.query(`select * from otps where user_id = ? and is_verified = ?`, {
            type: QueryTypes.SELECT,
            replacements: [userId, false]
        });

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
