module.exports = {
    getBuiltInLogger: logger => require(`./${logger}`)
};
