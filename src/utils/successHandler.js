export const successHandler = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        message,
        status: true,
        success: true,
        data,
    });
};