const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("configure logger", () => {
    test("configuration is passed to logger", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon()
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: true
            })
            .configureLogger("FAKE", { setting: "ABC" });

        expect(fakeLogger.getConfig()).toEqual({ setting: "ABC" });
    });

    test("logger missing configuration method does not error", () => {
        const MinimumLogger = function() {
            return { getConfig: () => ({}) };
        };
        const logger = new MinimumLogger();

        new Pickaroon()
            .registerLogger(logger, {
                name: "FAKE",
                enabled: true
            })
            .configureLogger("FAKE", { setting: "ABC" });

        expect(logger.getConfig()).toEqual({});
    });

    test("configuration object configures logger", () => {
        const fakeLogger = new FakeLogger();

        new Pickaroon()
            .registerLogger(fakeLogger, {
                name: "FAKE",
                enabled: true
            })
            .configure({
                FAKE: {
                    setting: "ABC"
                }
            });

        expect(fakeLogger.getConfig()).toEqual({ setting: "ABC" });
    });
});
