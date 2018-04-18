const { getBuiltInLogger } = require("./built-in-loggers");

function getNameAndLevelFromArguments(levels, ...args) {
    if (typeof args[0] === "object") {
        if (typeof args[0].enabled === "undefined") {
            args[0].enabled = true;
        }

        return args[0];
    }

    const firstArgumentIsLevel = levels.isValidLevel(args[0]);
    const level = firstArgumentIsLevel ? args[0] : undefined;

    return {
        level: level,
        name: firstArgumentIsLevel ? args[1] : args[0],
        enabled: true
    };
}

module.exports = function buildLogger(levels, logger, ...args) {
    if (typeof logger === "string") {
        logger = new (getBuiltInLogger(logger))();
    }

    const builtLogger = Object.assign(
        { logger: logger },
        getNameAndLevelFromArguments(levels, ...args)
    );

    if (
        builtLogger.enabled &&
        builtLogger.logger.start &&
        typeof builtLogger.logger.start === "function"
    ) {
        builtLogger.logger.start();
    }

    return builtLogger;
};
