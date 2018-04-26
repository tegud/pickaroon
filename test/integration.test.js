const Pickaroon = require("../");
const FakeLogger = require("./lib/fake-logger");
const moment = require("moment");
const dgram = require("dgram");

describe("integration tests", () => {
    describe("single logger", () => {
        let logSpy;

        afterEach(() => {
            if (logSpy) {
                logSpy.mockReset();
                logSpy.mockRestore();
            }
        });

        test("logs info messages", () => {
            let lastLogged;

            moment.__setDate("2018-01-01T00:00:00.000Z");

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            new Pickaroon()
                .configure({
                    default: {
                        includeTimestamp: true,
                        includeLevel: true
                    }
                })
                .logInfo("TEST");

            expect(lastLogged).toEqual("2018-01-01T00:00:00Z - info - TEST");
        });
    });

    describe("multiple loggers", () => {
        let logSpy;
        let logger;
        let udpClient;

        beforeAll(() => {
            logger = new Pickaroon()
                .registerLogger("logstash", {
                    name: "logstash",
                    enabled: false
                })
                .configure({
                    default: {
                        includeTimestamp: true,
                        includeLevel: true
                    },
                    logstash: {
                        protocol: "udp",
                        host: "127.0.0.1",
                        port: 9000,
                        eventType: "test",
                        enabled: true
                    }
                });
        });

        afterEach(() => {
            if (logSpy) {
                logSpy.mockReset();
                logSpy.mockRestore();
            }

            if (udpClient) {
                udpClient.close();
            }
        });

        afterAll(() => {
            logger.stop();
        });

        test("logs console messages", () => {
            let lastLogged;

            moment.__setDate("2018-01-01T00:00:00.000Z");

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            logger.logInfo("TEST");

            expect(lastLogged).toEqual("2018-01-01T00:00:00Z - info - TEST");
        });

        test("logs udp messages", done => {
            moment.__setDate("2018-01-01T00:00:00.000Z");

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => {});

            udpClient = dgram.createSocket("udp4");
            udpClient.bind(9000);

            udpClient.on("message", message => {
                const data = message.toString("utf-8");
                const parsedData = JSON.parse(data);

                expect(parsedData).toEqual({
                    "@timestamp": "2018-01-01T00:00:00.000Z",
                    message: "TEST",
                    level: "info",
                    type: "test"
                });

                done();
            });

            logger.logInfo("TEST");
        });
    });
});
