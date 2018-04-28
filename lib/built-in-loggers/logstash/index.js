const objectPath = require("object-path");
const protocols = {
    tcp: require("./protocols/tcp"),
    udp: require("./protocols/udp")
};

function protocolLifeCycleMethod(protocol, method) {
    if (!protocol || !protocol[method]) {
        return Promise.resolve();
    }

    return protocol[method]();
}

module.exports = function() {
    const config = {};
    let protocol;

    function getConfig(path) {
        return objectPath.get(config, path);
    }

    return {
        ...["start", "stop"].reduce((lifecycleMethods, method) => {
            lifecycleMethods[method] = () =>
                protocolLifeCycleMethod(protocol, method);

            return lifecycleMethods;
        }, {}),
        log: (level, logObject) => {
            const message = JSON.stringify(
                Object.keys(logObject).reduce(
                    (newObject, property) => {
                        if (!["timestamp", "level"].includes(property)) {
                            newObject[property] = logObject[property];
                        }

                        return newObject;
                    },
                    {
                        "@timestamp": logObject.timestamp,
                        level: level.toLowerCase(),
                        ...(config.eventType ? { type: config.eventType } : {}),
                        ...config.fields
                    }
                )
            );

            protocol.send(message);
        },
        configure: newConfig => {
            if (newConfig.protocol) {
                const Protocol = protocols[newConfig.protocol];
                protocol = new Protocol(getConfig);
            }

            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            });
        }
    };
};
