const moment = require("moment");
const fieldNameStandards = require("./get-field-name");

function setFieldPropertyNames(fieldStandard, message) {
    const getFieldName = fieldNameStandards[fieldStandard];

    if (fieldStandard === "none") {
        return message;
    }

    return Object.keys(message).reduce((newObject, property) => {
        newObject[getFieldName(property)] = message[property];

        return newObject;
    }, {});
}

function buildMessage(config, ...args) {
    const timestamp = { timestamp: moment().utc() };

    if (typeof args[0] === "object") {
        return { ...timestamp, ...args[0], ...config.fields };
    }

    const baseMessage = {
        message: args[0],
        ...timestamp,
        ...config.fields
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
    const message = buildMessage(config, ...args);

    return setFieldPropertyNames(config.fieldStandard, message);
};
