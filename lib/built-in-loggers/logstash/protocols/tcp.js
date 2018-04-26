const { Socket } = require("net");

module.exports = function(getConfig) {
    const client = new Socket();

    client.on("error", e => console.log(`TCP Client error: ${e.message}`));

    return {
        start: () =>
            new Promise(resolve =>
                client.connect(getConfig("port"), getConfig("host"), () =>
                    resolve()
                )
            ),
        stop: () => {
            client.end();
            return Promise.resolve();
        },
        send: data => client.write(data)
    };
};
