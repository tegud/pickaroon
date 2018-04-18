module.exports = function(levels) {
    function allLevels() {
        return Object.keys(levels);
    }

    return {
        allLevels,
        isValidLevel: level => allLevels().includes(level),
        shouldLog: (threshold, level) => levels[level] < levels[threshold]
    };
};
