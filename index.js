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

    function createConfigObject(loggerName, config) {
        const configObject = {};

        configObject[loggerName] = config;

        return configObject;
    }

    function configure(loggerConfigs) {
        const remainingConfig = Object.keys(loggerConfigs).reduce(
            (remaining, property) => {
                const matchingLoggers = loggers.get(property);

                if (!matchingLoggers.length) {
                    remaining[property] = loggerConfigs[property];
                    return remaining;
                }

                matchingLoggers.forEach(logger => {
                    const remainingConfig = Object.keys(
                        loggerConfigs[property]
                    ).reduce((remaining, configProperty) => {
                        if (configProperty === "enabled") {
                            enable(
                                logger,
                                loggerConfigs[property][configProperty]
                            );
                            return remaining;
                        }

                        if (configProperty === "level") {
                            logger.level =
                                typeof loggerConfigs[property][
                                    configProperty
                                ] === "function"
                                    ? loggerConfigs[property][configProperty]
                                    : () =>
                                        loggerConfigs[property][
                                            configProperty
                                        ];
                            return remaining;
                        }

                        remaining[configProperty] =
                            loggerConfigs[property][configProperty];
                        return remaining;
                    }, {});

                    if (!logger.logger.configure) {
                        return;
                    }

                    logger.logger.configure(remainingConfig);
                });

                return remaining;
            },
            {}
        );

        Object.keys(remainingConfig).forEach(property =>
            loggers.configure(property, remainingConfig[property])
        );
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
                    configure(createConfigObject(loggerName, { level }));
                }

                return api;
            },
            configureLogger: (loggerName, config) => {
                configure(createConfigObject(loggerName, config));
                return api;
            },
            configure: (...args) => {
                configure(...args);
                return api;
            },
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
            },
            stop: () => {
                loggers.all().forEach(logger => enable(logger, false));

                return Promise.resolve();
            }
        }
    );

    return api;
};
