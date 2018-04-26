const LogstashLogger = require("../../lib/built-in-loggers/logstash");
const moment = require("moment");
const net = require("net");

describe("logstash tcp logger", () => {
    let tcpServer;
    let logger;
    let onData;
    let logSpy;

    beforeEach(done => {
        tcpServer = net.createServer(socket => {
            socket.on("data", msg => {
                const data = msg.toString("utf-8");
                const parsedData = JSON.parse(data);

                onData(parsedData);
            });
        });

        tcpServer.on("error", e => {
            console.log(`ERROR!!! ${e.code}`);
        });

        tcpServer.listen(9999, "0.0.0.0", () => {
            done();
        });
    });

    afterEach(() => {
        tcpServer.close();
        onData = undefined;
        logger.stop();

        if (logSpy) {
            logSpy.mockReset();
            logSpy.mockRestore();
        }
    });

    test("formatted event is sent", done => {
        logger = new LogstashLogger();

        logger.configure({
            protocol: "tcp",
            host: "127.0.0.1",
            port: 9999
        });

        logger.start().then(() => {
            logger.log("INFO", {
                message: "TEST",
                timestamp: moment("2018-04-21T23:20:00Z").utc()
            });

            onData = parsedData => {
                expect(parsedData).toEqual({
                    "@timestamp": "2018-04-21T23:20:00.000Z",
                    message: "TEST",
                    level: "info"
                });

                done();
            };
        });
    });

    test("tcp error is logged to console", done => {
        logger = new LogstashLogger();

        logSpy = jest.spyOn(console, "log").mockImplementation(messageIn => {
            expect(messageIn).toBe(
                "TCP Client error: connect ECONNREFUSED 127.0.0.1:9998"
            );
            done();
        });

        logger.configure({
            protocol: "tcp",
            host: "127.0.0.1",
            port: 9998
        });

        logger.start().then(() => {
            logger.log("INFO", {
                message: "TEST",
                timestamp: moment("2018-04-21T23:20:00Z").utc()
            });
        });
    });
});
