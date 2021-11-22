/* eslint-disable zillow/import/no-extraneous-dependencies, no-console */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Set headers for all APIs
app.use((request, response, next) => {
    response.append('Access-Control-Allow-Origin', ['*']);
    next();
});

// Adds the `body` property to `request` so that we can parse content sent in
// the body of POST requests.
app.use(bodyParser.json());

// Open the server on port 13390
app.listen(13390, () => {
    console.log('Mock API server running on port 13390');
});

// Define routes
app.get('/', (request, response) => {
    response.send('test');
});
