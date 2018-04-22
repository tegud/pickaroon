const Loggers = require("./lib/loggers");
const buildLogger = require("./lib/build-logger");
const Levels = require("./lib/levels");

module.exports = function() {
    const availableLevels = new Levels(
        {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3
        },
        "INFO"
    );

    const loggers = new Loggers(
        availableLevels,
        buildLogger(availableLevels, "console", "default")
    );

    function enable(logger, enable) {
        if (logger.enabled === enable) {
            return;
        }

        logger.enabled = enable;

        const lifecycleMethod = enable ? "start" : "stop";
        if (
            logger.logger[lifecycleMethod] &&
            typeof logger.logger[lifecycleMethod] === "function"
        ) {
            logger.logger[lifecycleMethod]();
        }
    }

    function configureLogger(loggerName, config) {
        loggers.get(loggerName).forEach(logger => {
            const remainingConfig = Object.keys(config).reduce(
                (remaining, configProperty) => {
                    if (configProperty === "enabled") {
                        enable(logger, config[configProperty]);
                        return remaining;
                    }

                    if (configProperty === "level") {
                        logger.level =
                            typeof config[configProperty] === "function"
                                ? config[configProperty]
                                : () => config[configProperty];
                        return remaining;
                    }

                    remaining[configProperty] = config[configProperty];
                    return remaining;
                },
                {}
            );

            if (!logger.logger.configure) {
                return;
            }

            logger.logger.configure(remainingConfig);
        });
    }

    const api = availableLevels.allLevels().reduce(
        (allLevels, level) => {
            allLevels[`log${level[0]}${level.substring(1).toLowerCase()}`] = (
                ...args
            ) => loggers.log(level, ...args);

            return allLevels;
        },
        {
            setLogLevel: (loggerName, level) => {
                if (!level) {
                    availableLevels.setGlobalLogLevel(loggerName);
                } else {
                    configureLogger(loggerName, { level });
                }

                return api;
            },
            configureLogger,
            removeLogger: loggerName => {
                loggers
                    .get(loggerName)
                    .forEach(logger => enable(logger, false));

                loggers.remove(loggerName);

                return api;
            },
            registerLogger: (...args) => {
                loggers.add(buildLogger(availableLevels, ...args));

                return api;
            },
            setFieldStandard: value => {
                loggers.configure("fieldStandard", value);
                return api;
            }
        }
    );

    return api;
};
