function logString(config, level, logObject) {
    const prefixes = [];

    if (config.includeTimestamp && logObject.timestamp) {
        prefixes.push(logObject.timestamp.format());
    }

    if (config.includeLevel) {
        prefixes.push(level.toLowerCase());
    }

    if (config) return [...prefixes, logObject.message].join(" - ");
}

module.exports = function ConsoleLogger() {
    const config = {};

    return {
        log: (...args) => console.log(logString(config, ...args)),
        configure: newConfig =>
            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            })
    };
};
