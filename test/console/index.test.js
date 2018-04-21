const moment = require("moment");

const ConsoleLogger = require("../../lib/built-in-loggers/console");

describe("levels", () => {
    let logSpy;

    afterEach(() => {
        logSpy.mockReset();
        logSpy.mockRestore();

        moment.__reset();
    });

    test("logs info messages", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.log("INFO", { message: "TEST" });

        expect(lastLogged).toEqual("TEST");
    });

    test("logs level when configured", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({ includeLevel: true });

        logger.log("INFO", { message: "TEST" });

        expect(lastLogged).toEqual("info - TEST");
    });

    test("logs timestamp when configured", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({ includeTimestamp: true });

        logger.log("INFO", {
            message: "TEST",
            timestamp: moment("2018-04-21T23:20:00Z").utc()
        });

        expect(lastLogged).toEqual("2018-04-21T23:20:00Z - TEST");
    });
});
