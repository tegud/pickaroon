module.exports = function(...args) {
    let loggers = [...args];

    return {
        add: logger => loggers.push(logger),
        remove: loggerName => {
            loggers = loggers.filter(logger => logger.name !== loggerName);
        },
        get: loggerName => loggers.filter(logger => logger.name === loggerName),
        all: () => loggers
    };
};
