const { getBuiltInLogger } = require("./built-in-loggers");

function getNameAndLevelFromArguments(levels, ...args) {
    if (typeof args[0] === "object") {
        if (typeof args[0].enabled === "undefined") {
            args[0].enabled = true;
        }

        const level = args[0].level;
        args[0].level = () => level;

        return args[0];
    }

    const firstArgumentIsLevel =
        levels.isValidLevel(args[0]) || typeof args[0] === "function";
    const level = firstArgumentIsLevel ? args[0] : undefined;

    return {
        level: typeof args[0] === "function" ? args[0] : () => level,
        name: firstArgumentIsLevel ? args[1] : args[0],
        enabled: true
    };
}

module.exports = function buildLogger(levels, logger, ...args) {
    if (typeof logger === "string") {
        logger = new (getBuiltInLogger(logger))();
    }

    const builtLogger = {
        logger,
        ...getNameAndLevelFromArguments(levels, ...args)
    };

    if (
        builtLogger.enabled &&
        builtLogger.logger.start &&
        typeof builtLogger.logger.start === "function"
    ) {
        builtLogger.logger.start();
    }

    if (typeof args[0] === "object" && builtLogger.logger.configure) {
        builtLogger.logger.configure(
            Object.keys(args[0]).reduce((config, property) => {
                if (["level", "name", "enabled"].includes(property)) {
                    return config;
                }

                config[property] = args[0][property];
                return config;
            }, {})
        );
    }

    return builtLogger;
};
