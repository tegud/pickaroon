const net = require("net");

module.exports = function() {
    const client = new net.Socket();

    client.on("error", e => console.log(`TCP Client error: ${e.message}`));

    const config = {};

    return {
        configure: newConfig =>
            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            }),
        start: () =>
            new Promise(resolve => {
                client.connect(config.port, config.host, () => resolve());
            }),
        stop: () => {
            client.end();
            return Promise.resolve();
        },
        send: data => client.write(data)
    };
};
