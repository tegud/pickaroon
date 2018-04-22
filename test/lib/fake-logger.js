module.exports = function FakeLogger() {
    let started = false;
    let lastLogged;
    let config;

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
        resetIsStarted: () => (started = false),
        configure: newConfig => (config = newConfig),
        getConfig: () => config
    };
};
