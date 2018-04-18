const Loggers = require("./lib/loggers");
const buildLogger = require("./lib/build-logger");
const Levels = require("./lib/levels");

const availableLevels = new Levels({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
});

module.exports = function() {
    const loggers = new Loggers(
        buildLogger(availableLevels, "console", "default")
    );
    let globalLogLevel = "INFO";

    function log(...args) {
        const [level] = args;

        loggers.all().forEach(logger => {
            if (
                !logger.enabled ||
                availableLevels.shouldLog(
                    typeof logger.level !== "undefined"
                        ? logger.level
                        : globalLogLevel,
                    level
                )
            ) {
                return;
            }

            logger.logger.log(...args);
        });
    }

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
            Object.keys(config).forEach(configProperty => {
                if (configProperty === "enabled") {
                    enable(logger, config[configProperty]);
                    return;
                }

                logger[configProperty] = config[configProperty];
            });
        });
    }

    const api = availableLevels.allLevels().reduce(
        (allLevels, level) => {
            allLevels[`log${level[0]}${level.substring(1).toLowerCase()}`] = (
                ...args
            ) => log(level, ...args);

            return allLevels;
        },
        {
            setLogLevel: (loggerName, level) => {
                if (!level) {
                    globalLogLevel = loggerName;
                    return api;
                }

                configureLogger(loggerName, { level });

                return api;
            },
            configureLogger: configureLogger,
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
            }
        }
    );

    return api;
};
