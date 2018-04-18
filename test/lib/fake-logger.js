module.exports = function FakeLogger() {
    let started = false;
    let lastLogged;

    return {
        log: (level, message) => (lastLogged = message),
        start: () => {
            started = true;
            return Promise.resolve();
        },
        stop: () => {
            started = false;
            return Promise.resolve();
        },
        lastLogged: () => lastLogged,
        isStarted: () => started,
        resetIsStarted: () => (started = false)
    };
};
