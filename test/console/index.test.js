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

    test("logs timestamp & level when configured", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({ includeTimestamp: true, includeLevel: true });

        logger.log("INFO", {
            message: "TEST",
            timestamp: moment("2018-04-21T23:20:00Z").utc()
        });

        expect(lastLogged).toEqual("2018-04-21T23:20:00Z - info - TEST");
    });

    test("logs specified fields as prefixes", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({
            includeTimestamp: true,
            includeLevel: true,
            prefixFields: ["request_id"]
        });

        logger.log("INFO", {
            message: "TEST",
            request_id: "12345",
            timestamp: moment("2018-04-21T23:20:00Z").utc()
        });

        expect(lastLogged).toEqual(
            "2018-04-21T23:20:00Z - info - 12345 - TEST"
        );
    });

    test("logs specified fields as prefixes when missing", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({
            includeTimestamp: true,
            includeLevel: true,
            prefixFields: ["request_id"]
        });

        logger.log("INFO", {
            message: "TEST",
            timestamp: moment("2018-04-21T23:20:00Z").utc()
        });

        expect(lastLogged).toEqual("2018-04-21T23:20:00Z - info - TEST");
    });

    test("logs additional fields after message", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const logger = new ConsoleLogger();

        logger.configure({
            includeTimestamp: true,
            includeLevel: true
        });

        logger.log("INFO", {
            message: "TEST",
            request_id: "12345",
            session_id: "ABCDE",
            timestamp: moment("2018-04-21T23:20:00Z").utc()
        });

        expect(lastLogged).toEqual(
            "2018-04-21T23:20:00Z - info - TEST, request_id=12345 session_id=ABCDE"
        );
    });
});
