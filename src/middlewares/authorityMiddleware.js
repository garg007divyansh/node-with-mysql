export const checkSuperAdmin = (req, res, next) => {
    const { user } = req;
    if (user.roleId !== 1) {
        return res.status(403).json({
            message: 'Unauthorized Access',
            status: false,
            success: false,
        });
    }
    next();
};

export const checkPartner = (req, res, next) => {
    const { user } = req;
    if (user.roleId !== 2) {
        return res.status(403).json({
            message: 'Unauthorized Access',
            status: false,
            success: false,
        });
    }
    next();
};

export const checkCustomer = (req, res, next) => {
    const { user } = req;
    if (user.roleId !== 3) {
        return res.status(403).json({
            message: 'Unauthorized Access',
            status: false,
            success: false,
        });
    }
    next();
};