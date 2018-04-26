const dgram = require("dgram");

module.exports = function(getConfig) {
    const udpClient = dgram.createSocket("udp4");

    return {
        stop: () => {
            udpClient.close();
            return Promise.resolve();
        },
        send: message => {
            udpClient.send(
                new Buffer(message),
                0,
                message.length,
                getConfig("port"),
                getConfig("host")
            );
        }
    };
};
