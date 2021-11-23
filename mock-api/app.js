/* eslint-disable zillow/import/no-extraneous-dependencies, no-console */
const express = require('express');
const multer = require('multer');
const designs = require('./data/designs');
const products = require('./data/products');

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
    const now = new Date();
    Object.assign(storedDesign, design, {
        active: design.active === 'true' ? '1' : '0',
        updated: `${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}`,
    });
    response.json({
        message: '',
        valid: true,
    });
});

app.get('/api/products.php', (request, response) => {
    const { query } = request;
    let relevantProducts = products;
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantProducts = relevantProducts.filter(product =>
            product[searchCriteria].includes(searchTerm)
        );
    }
    response.json(relevantProducts);
});

app.post('/api/products.php', (request, response) => {
    const product = request.body;
    const now = new Date();
    if (product.new) {
        products.push({
            id: products.length,
            created: `${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}`,
            name: product.name,
            manufacturer: product.manufacturer,
            colors: JSON.stringify(product.colors),
            variations: product.variations,
            url: product.url,
            status: product.status,
            notes: JSON.stringify(product.notes),
            embed: product.embed,
        });
    } else {
        const storedProduct = products.find(_storedProduct => _storedProduct.id === product.id);
        if (!storedProduct) {
            response.json({
                message: 'not found',
                valid: false,
            });
            return;
        }
        Object.assign(storedProduct, {
            name: product.name,
            manufacturer: product.manufacturer,
            colors: JSON.stringify(product.colors),
            variations: product.variations,
            url: product.url,
            status: product.status,
            notes: JSON.stringify(product.notes),
            embed: product.embed,
        });
    }
    response.json({
        message: '',
        valid: true,
    });
});
