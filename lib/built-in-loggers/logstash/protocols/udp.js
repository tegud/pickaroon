const dgram = require("dgram");

module.exports = function() {
    const udpClient = dgram.createSocket("udp4");
    const config = {};

    return {
        configure: newConfig =>
            Object.keys(newConfig).forEach(property => {
                config[property] = newConfig[property];
            }),
        start: () => Promise.resolve(),
        stop: () => {
            udpClient.close();
            return Promise.resolve();
        },
        send: message => {
            udpClient.send(
                new Buffer(message),
                0,
                message.length,
                config.port,
                config.host
            );
        }
    };
};
