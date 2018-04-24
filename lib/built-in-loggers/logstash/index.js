const protocols = {
    tcp: require("./protocols/tcp"),
    udp: require("./protocols/udp")
};

module.exports = function() {
    const config = {};
    let protocol;

    return {
        start: () =>
            protocol && protocol.start ? protocol.start() : Promise.resolve(),
        stop: () =>
            protocol && protocol.stop ? protocol.stop() : Promise.resolve(),
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
                        ...(config.eventType ? { type: config.eventType } : {})
                    }
                )
            );

            protocol.send(message);
        },
        configure: newConfig => {
            if (newConfig.protocol) {
                const Protocol = protocols[newConfig.protocol];
                protocol = new Protocol();
            }

            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            });

            if (protocol) {
                protocol.configure(newConfig);
            }
        }
    };
};
