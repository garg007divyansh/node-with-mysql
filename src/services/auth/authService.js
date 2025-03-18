import sequelize from "../../loaders/connection.js";
import { QueryTypes } from "sequelize";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";

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
        // const user = await Users.findOne({ email: email });
        // if (!user) {
        //     return { success: false, message: 'User not found' };
        // }

        let userData = await sequelize.query(`select * from users where email = ?`, {
            type: QueryTypes.SELECT,
            replacements: [email]
        });
        if (userData.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const expiredTime = moment().utc().add(2, 'minutes').toDate();
        const otp = Math.floor(100000 + Math.random() * 900000);

        let otpData;

        // Check if OTP already exists for the user
        const existingOtp = await Otps.findOne({ userId: user._id });
        if (existingOtp) {
            // Update the existing OTP document
            existingOtp.otp = otp;
            existingOtp.verified = false;
            existingOtp.expiredTime = expiredTime;
            otpData = await existingOtp.save();
        } else {
            // Create a new OTP document
            otpData = new Otps({
                userId: user._id,
                otp,
                verified: false,
                expiredTime,
            });
            await otpData.save();
        }

        // Send OTP via email (common for both cases)
        const emailSubject = 'Your OTP Code';
        const emailText = `Dear ${user.name},\n\nYour OTP code is ${otp}. Please use this code to verify your account.\n\nThank you!`;
        await sendMail(email, emailSubject, emailText);

        return { user, otpData, success: true };
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
