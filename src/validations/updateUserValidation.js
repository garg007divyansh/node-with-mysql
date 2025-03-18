export const validateUpdateUser = (data) => {
    const { name, email, phone } = data;

    if (!name) {
        return { isValid: false, message: 'Name is required' };
    }

    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    if (!phone) {
        return { isValid: false, message: 'Phone number is required' };
    }

    return { isValid: true };
};
