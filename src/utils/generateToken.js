import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token, secretKey) => {
    // return jwt.verify(token, secretKey);
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};