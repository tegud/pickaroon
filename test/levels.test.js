const Pickaroon = require("../");
const FakeLogger = require("./lib/fake-logger");

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

    test("accepts lower case level", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon().setLogLevel("debug").logInfo("TEST");

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

    describe("variable log level", () => {
        test("does not log when global log level function returns lower log level", () => {
            let lastLogged;

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            new Pickaroon().setLogLevel(() => "INFO").logDebug("TEST");

            expect(lastLogged).toEqual(undefined);
        });

        test("logs when global log level function returns valid log level", () => {
            let lastLogged;

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            new Pickaroon().setLogLevel(() => "DEBUG").logDebug("TEST");

            expect(lastLogged).toEqual("TEST");
        });

        test("does not log when individual logger log level function returns lower log level", () => {
            let lastLogged;

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            new Pickaroon()
                .setLogLevel("default", () => "INFO")
                .logDebug("TEST");

            expect(lastLogged).toEqual(undefined);
        });

        test("logs when individual logger log level function returns valid level", () => {
            let lastLogged;

            logSpy = jest
                .spyOn(console, "log")
                .mockImplementation(messageIn => (lastLogged = messageIn));

            new Pickaroon()
                .setLogLevel("default", () => "DEBUG")
                .logDebug("TEST");

            expect(lastLogged).toEqual("TEST");
        });

        test("does not logs when logger registered with log level function returns valid level", () => {
            const fakeLogger = new FakeLogger();

            const pickaroon = new Pickaroon()
                .removeLogger("default")
                .registerLogger(fakeLogger, () => "INFO")
                .logDebug("TEST");

            expect(fakeLogger.lastLogged()).toEqual(undefined);
        });
    });
});
