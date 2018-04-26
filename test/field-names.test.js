const moment = require("moment");
const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("field names", () => {
    beforeEach(() => {
        moment.__reset();
    });
    describe("snake_case", () => {
        test("field names are set", () => {
            const fakeLogger = new FakeLogger();

            moment.__setDate("2018-01-01T00:00:00.000Z");

            const pickaroon = new Pickaroon()
                .setFieldStandard("snake_case")
                .removeLogger("default")
                .registerLogger(fakeLogger)
                .logInfo({
                    snake_case: "abc",
                    camelCase: "hello",
                    "Title Case": "world"
                });

            expect(fakeLogger.lastLogged()).toEqual({
                timestamp: moment("2018-01-01T00:00:00.000Z").utc(),
                snake_case: "abc",
                camel_case: "hello",
                title_case: "world"
            });
        });
    });

    describe("camelCase", () => {
        test("field names are set", () => {
            const fakeLogger = new FakeLogger();

            moment.__setDate("2018-01-01T00:00:00.000Z");

            const pickaroon = new Pickaroon()
                .setFieldStandard("camelCase")
                .removeLogger("default")
                .registerLogger(fakeLogger)
                .logInfo({
                    snake_case: "abc",
                    camelCase: "hello",
                    "Title Case": "world"
                });

            expect(fakeLogger.lastLogged()).toEqual({
                timestamp: moment("2018-01-01T00:00:00.000Z").utc(),
                snakeCase: "abc",
                camelCase: "hello",
                titleCase: "world"
            });
        });
    });
});
