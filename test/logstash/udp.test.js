const LogstashLogger = require("../../lib/built-in-loggers/logstash");
const moment = require("moment");
const dgram = require("dgram");

describe("logstash udp logger", () => {
    let udpClient;
    let logger;

    beforeEach(() => {
        udpClient = dgram.createSocket("udp4");
        udpClient.bind(9999);
    });

    afterEach(() => {
        udpClient.close();
        logger.stop();
    });

    test("formatted event is sent", done => {
        logger = new LogstashLogger();

        logger.configure({
            protocol: "udp",
            host: "127.0.0.1",
            port: 9999
        });

        logger.start().then(() => {
            logger.log("INFO", {
                message: "TEST",
                timestamp: moment("2018-04-21T23:20:00Z").utc()
            });

            udpClient.on("message", message => {
                const data = message.toString("utf-8");
                const parsedData = JSON.parse(data);

                expect(parsedData).toEqual({
                    "@timestamp": "2018-04-21T23:20:00.000Z",
                    message: "TEST",
                    level: "info"
                });

                done();
            });
        });
    });

    test("configured eventType is appended to event", done => {
        logger = new LogstashLogger();

        logger.configure({
            protocol: "udp",
            host: "127.0.0.1",
            port: 9999,
            eventType: "test"
        });

        logger.start().then(() => {
            logger.log("INFO", {
                message: "TEST",
                timestamp: moment("2018-04-21T23:20:00Z").utc()
            });

            udpClient.on("message", message => {
                const data = message.toString("utf-8");
                const parsedData = JSON.parse(data);

                expect(parsedData).toEqual({
                    "@timestamp": "2018-04-21T23:20:00.000Z",
                    message: "TEST",
                    level: "info",
                    type: "test"
                });

                done();
            });
        });
    });
});
