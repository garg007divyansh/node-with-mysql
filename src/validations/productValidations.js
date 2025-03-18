export const validateAddProduct = (data) => {
    const { name, price, image, category, stock } = data;

    if (!name) {
        return { isValid: false, message: 'Product name is required' };
    }

    if (!price) {
        return { isValid: false, message: 'Price is required' };
    }

    if (price < 0) {
        return { isValid: false, message: 'Price is not less than 0' };
    }

    if (!image) {
        return { isValid: false, message: 'Product image is required' };
    }

    if (!category) {
        return { isValid: false, message: 'Product category is required' };
    }

    if (!stock) {
        return { isValid: false, message: 'Stock is required' };
    }

    if (stock < 0) {
        return { isValid: false, message: 'Stock is not less than 0' };
    }

    return { isValid: true };
};
