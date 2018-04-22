function logString(config, level, logObject) {
    const prefixes = [];

    if (config.includeTimestamp && logObject.timestamp) {
        prefixes.push(logObject.timestamp.format());
    }

    if (config.includeLevel) {
        prefixes.push(level.toLowerCase());
    }

    const additionalFields = Object.keys(logObject).reduce(
        (fields, property) => {
            if (
                ["timestamp", "message", ...config.prefixFields].includes(
                    property
                )
            ) {
                return fields;
            }

            fields.push({ key: property, value: logObject[property] });

            return fields;
        },
        []
    );

    const prefixesAndMessages = [
        ...prefixes,
        ...config.prefixFields.reduce((fields, field) => {
            if (logObject[field]) {
                fields.push(logObject[field]);
            }

            return fields;
        }, []),
        logObject.message
    ].join(" - ");

    const additionalFieldText = `${
        additionalFields.length ? ", " : ""
    }${additionalFields.map(field => `${field.key}=${field.value}`).join(" ")}`;

    return `${prefixesAndMessages}${additionalFieldText}`;
}

module.exports = function ConsoleLogger() {
    const config = {
        prefixFields: []
    };

    return {
        log: (...args) => console.log(logString(config, ...args)),
        configure: newConfig =>
            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            })
    };
};
