module.exports = function ConsoleLogger() {
    return {
        log: (level, message) => console.log(message.message)
    };
};
