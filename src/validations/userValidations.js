export const validateUser = (data) => {
    const { name, email, phone, password, roleId } = data;

    if (!name) {
        return { isValid: false, message: 'Name is required' };
    }

    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    if (!phone) {
        return { isValid: false, message: 'Phone number is required' };
    }

    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (!roleId) {
        return { isValid: false, message: 'Role Id is required' };
    }

    return { isValid: true };
};
