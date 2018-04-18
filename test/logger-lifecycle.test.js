const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("logger lifecycle", () => {
    test("registered logger is started if enabled", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon().registerLogger(fakeLogger, {
            name: "FAKE"
        });

        expect(fakeLogger.isStarted()).toEqual(true);
    });

    test("registered logger is not started if disabled", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon().registerLogger(fakeLogger, {
            name: "FAKE",
            enabled: false
        });

        expect(fakeLogger.isStarted()).toEqual(false);
    });

    test("registered logger is started if configured to enabled", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon()
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: false
            })
            .configureLogger("FAKE", { enabled: true });

        expect(fakeLogger.isStarted()).toEqual(true);
    });

    test("registered logger is not started again if already configured to enabled", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon().registerLogger(fakeLogger, {
            name: "FAKE",
            enabled: true
        });

        fakeLogger.resetIsStarted();

        pickaroon.configureLogger("FAKE", { enabled: true });

        expect(fakeLogger.isStarted()).toEqual(false);
    });

    test("registered logger is stopped if configured to enabled", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon()
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: true
            })
            .configureLogger("FAKE", { enabled: false });

        expect(fakeLogger.isStarted()).toEqual(false);
    });
});
