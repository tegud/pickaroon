const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("register logger", () => {
    test("uses registered logger", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .logError("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("sets level for registered logger", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, "DEBUG")
            .logDebug("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("sets name and level for registered logger", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, "FAKE", "INFO")
            .setLogLevel("FAKE", "DEBUG")
            .logDebug("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("sets only name for registered logger", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, "FAKE")
            .setLogLevel("FAKE", "DEBUG")
            .logDebug("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("sets options for registered logger", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, {
                name: "FAKE"
            })
            .setLogLevel("FAKE", "DEBUG")
            .logDebug("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("logger can be registered disabled", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: false
            })
            .setLogLevel("FAKE", "DEBUG")
            .logDebug("TEST");

        expect(fakeLogger.lastLogged()).toEqual(undefined);
    });

    test("named logger can be registered", () => {
        let lastLogged;

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(messageIn => (lastLogged = messageIn));

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger("console", {
                enabled: true
            })
            .logInfo("TEST");

        expect(lastLogged).toEqual("TEST");
    });
});
