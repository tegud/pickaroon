const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("remove logger", () => {
    test("removed logger does not log", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: true
            })
            .removeLogger("FAKE")
            .logInfo("TEST");

        expect(fakeLogger.lastLogged()).toEqual(undefined);
    });

    test("removed logger is stopped", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: true
            })
            .removeLogger("FAKE")
            .logInfo("TEST");

        expect(fakeLogger.isStarted()).toEqual(false);
    });
});
