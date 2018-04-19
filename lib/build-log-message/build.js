module.exports = function buildLogMessage(...args) {
    if (typeof args[0] === "object") {
        return args[0];
    }

    const baseMessage = {
        message: args[0]
    };

    if (args.length > 1) {
        return Object.keys(args[1]).reduce((allLogData, property) => {
            if (property === "message") {
                allLogData.additional_message = args[1][property];
            } else {
                allLogData[property] = args[1][property];
            }

            return allLogData;
        }, baseMessage);
    }

    return baseMessage;
};
