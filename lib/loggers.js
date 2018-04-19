const buildLogMessage = require("./build-log-message/build");

module.exports = function(levels, ...args) {
    let loggers = [...args];

    function log(level, ...args) {
        const logMessage = buildLogMessage(...args);

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
        log
    };
};
