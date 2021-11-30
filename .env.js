const local = {
    REACT_APP_API_HOST: 'localhost',
    REACT_APP_API_PATH: '/api',
    REACT_APP_API_PORT: 13390,
    REACT_APP_API_SCHEME: 'http',
    ESLINT_NO_DEV_ERRORS: true,
}

module.exports = Promise.resolve({
    local,
    beta: {
        REACT_APP_API_HOST: 'api.beta.kitepaint.com',
        REACT_APP_API_PATH: '/php/admin',
        REACT_APP_API_SCHEME: 'https',
        REACT_APP_API_PORT: '',
    },
    prod: {
        REACT_APP_API_HOST: 'api.kitepaint.com',
        REACT_APP_API_PATH: '/php/admin',
        REACT_APP_API_SCHEME: 'https',
        REACT_APP_API_PORT: '',
    }
});
