const FakeLogger = require("./lib/fake-logger");
const Pickaroon = require("../");

describe("field names", () => {
    describe("snake_case", () => {
        test("field names are set", () => {
            const fakeLogger = new FakeLogger();

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
                snake_case: "abc",
                camel_case: "hello",
                title_case: "world"
            });
        });
    });

    describe("camelCase", () => {
        test("field names are set", () => {
            const fakeLogger = new FakeLogger();

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
                snakeCase: "abc",
                camelCase: "hello",
                titleCase: "world"
            });
        });
    });
});
