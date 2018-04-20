const fieldNameStandards = require("./get-field-name");

function setFieldPropertyNames(fieldStandard, message) {
    const getFieldName = fieldNameStandards[fieldStandard];

    return Object.keys(message).reduce((newObject, property) => {
        newObject[getFieldName(property)] = message[property];

        return newObject;
    }, {});
}

function buildMessage(...args) {
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
}

module.exports = function buildLogMessage(config, ...args) {
    const message = buildMessage(...args);

    return setFieldPropertyNames(config.fieldStandard, message);
};
