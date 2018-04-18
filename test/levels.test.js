const Pickaroon = require("../");

describe("levels", () => {
    let logSpy;

    afterEach(() => {
        if (logSpy) {
            logSpy.mockReset();
            logSpy.mockRestore();
        }
    });

    test("logs info messages", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon();

        pickaroon.logInfo("TEST");

        expect(lastLogged).toEqual("TEST");
    });

    test("logs debug messages when logLevel set to DEBUG", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon().setLogLevel("DEBUG");

        pickaroon.logDebug("TEST");

        expect(lastLogged).toEqual("TEST");
    });

    test("does not logs debug messages when logLevel set to default", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon();

        pickaroon.logInfo("TEST 1");
        pickaroon.logDebug("TEST 2");

        expect(lastLogged).toEqual("TEST 1");
    });

    test("logs warn messages", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon();

        pickaroon.logWarn("TEST");

        expect(lastLogged).toEqual("TEST");
    });

    test("logs error messages", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon();

        pickaroon.logError("TEST");

        expect(lastLogged).toEqual("TEST");
    });
});
