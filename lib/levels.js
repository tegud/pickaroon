module.exports = function(levels, logLevel) {
    function allLevels() {
        return Object.keys(levels);
    }

    let globalLogLevel = createLogLevelFunction(logLevel);

    function createLogLevelFunction(newLevel) {
        return typeof newLevel === "function" ? newLevel : () => newLevel;
    }

    return {
        allLevels,
        isValidLevel: level => allLevels().includes(level),
        shouldLog: (loggerThreshold, level) => {
            if (!loggerThreshold) {
                return levels[level] >= levels[globalLogLevel()];
            }

            return levels[level] >= levels[loggerThreshold];
        },
        setGlobalLogLevel: newLevel =>
            (globalLogLevel = createLogLevelFunction(newLevel))
    };
};
