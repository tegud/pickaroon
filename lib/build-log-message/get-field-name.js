module.exports = {
    snake_case: fieldName =>
        `${fieldName[0].toLowerCase()}${fieldName
            .substring(1)
            .replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`)
            .replace(/([ -])/g, () => ``)}`,
    camelCase: fieldName =>
        `${fieldName[0].toLowerCase()}${fieldName
            .substring(1)
            .replace(/[_ ]\w/g, m => m[1].toUpperCase())}`
};
