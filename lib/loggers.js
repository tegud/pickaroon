const buildLogMessage = require("./build-log-message");

const defaultConfig = {
    fieldStandard: "none"
};

module.exports = function(levels, ...args) {
    let loggers = [...args];
    const config = Object.keys(defaultConfig).reduce((newConfig, property) => {
        newConfig[property] = defaultConfig[property];

        return newConfig;
    }, {});

    function log(level, ...args) {
        const logMessage = buildLogMessage(config, ...args);

        loggers.forEach(logger => {
            if (logger.enabled && levels.shouldLog(logger.level(), level)) {
                logger.logger.log(level, logMessage);
            }
        });
    }
    return {
        add: logger => loggers.push(logger),
        remove: loggerName => {
            loggers = loggers.filter(logger => logger.name !== loggerName);
        },
        get: loggerName => loggers.filter(logger => logger.name === loggerName),
        log,
        configure: (setting, value) => (config[setting] = value)
    };
};
