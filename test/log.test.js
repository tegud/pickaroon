const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("log", () => {
    test("message is logged", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .logInfo("TEST");

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("additional properties are logged", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .logInfo("TEST", { x: 1 });

        expect(fakeLogger.lastLogged().x).toEqual(1);
    });

    test("message on additional property is renamed to additional_message", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .logInfo("TEST", { message: 1 });

        expect(fakeLogger.lastLogged().additional_message).toEqual(1);
    });

    test("message on additional property is renamed to additional_message", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .logInfo({ message: "TEST" });

        expect(fakeLogger.lastLogged().message).toEqual("TEST");
    });

    test("configured fields are logged", () => {
        const fakeLogger = new FakeLogger();

        const pickaroon = new Pickaroon()
            .removeLogger("default")
            .registerLogger(fakeLogger)
            .configure({ fields: { x: 12345 } })
            .logInfo({ message: "TEST" });

        expect(fakeLogger.lastLogged().x).toEqual(12345);
    });
});
