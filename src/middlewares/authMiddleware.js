import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access Denied. No token provided.',
            status: false,
            success: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            message: 'Token Expired, Please Login Again',
            status: false,
            success: false,
        });
    }
};
