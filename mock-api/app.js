/* eslint-disable zillow/import/no-extraneous-dependencies, no-console */
const express = require('express');
const designs = require('./data/designs');
const multer = require('multer');

const upload = multer();
const app = express();

// Set headers for all APIs
app.use((request, response, next) => {
    response.append('Access-Control-Allow-Origin', ['*']);
    next();
});

// Adds the `body` property to `request` so that we can parse content sent in
// the body of POST requests.
app.use(upload.array());
app.use(express.static('public'));

// Open the server on port 13390
app.listen(13390, () => {
    console.log('Mock API server running on port 13390');
});

// Define routes
app.get('/api/', (request, response) => {
    response.send('test');
});

app.get('/api/designs.php', (request, response) => {
    const { query } = request;
    let relevantDesigns = designs;
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantDesigns = relevantDesigns.filter(design =>
            design[searchCriteria].includes(searchTerm)
        );
    }
    response.json(relevantDesigns);
});

app.post('/api/designs.php', (request, response) => {
    const design = request.body;
    const storedDesign = designs.find(_storedDesign => _storedDesign.id === design.id);
    if (!storedDesign) {
        response.json({
            message: 'not found',
            valid: false,
        });
        return;
    }
    Object.assign(storedDesign, design, {
        active: design.active === 'true' ? '1' : '0',
    });
    response.json({
        message: '',
        valid: true,
    });
});
