/* eslint-disable zillow/import/no-extraneous-dependencies, no-console */
const express = require('express');
const multer = require('multer');
const designs = require('./data/designs');
const products = require('./data/products');
const manufacturers = require('./data/manufacturers');
const users = require('./data/users');

const upload = multer();
const app = express();

// Set headers for all APIs
app.use((request, response, next) => {
    response.append('Access-Control-Allow-Origin', ['*']);
    response.append('Access-Control-Allow-Headers', ['Kp-Auth-Token']);
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

app.get('/api/ping.php', (request, response) => {
    response.json({ message: 'pong' });
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
            id: products.length.toString(),
            created: `${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}`,
            name: product.name,
            manufacturer: product.manufacturer,
            colors: product.colors,
            variations: JSON.parse(product.variations),
            url: product.url,
            status: product.status,
            notes: product.notes,
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
            colors: product.colors,
            variations: JSON.parse(product.variations),
            url: product.url,
            status: '0',
            notes: product.notes,
            embed: product.embed,
        });
    }
    response.json({
        message: '',
        valid: true,
    });
});

app.get('/api/manufacturers.php', (request, response) => {
    response.json(manufacturers);
});

app.post('/api/manufacturers.php', (request, response) => {
    if (request.body.new) {
        const manufacturer = request.body;
        const now = new Date();
        manufacturers.push({
            id: manufacturers.length.toString(),
            activated: true,
            created: `${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}`,
            name: manufacturer.name,
            contact_name: manufacturer.contact_name,
            contact_phone: manufacturer.contact_phone,
            contact_email: manufacturer.contact_email,
            billing_email: manufacturer.billing_email,
            invoice_amount: manufacturer.invoice_amount,
            logo: manufacturer.logo,
            website: manufacturer.website,
        });
    } else {
        const { id } = request.body;
        const manufacturer = manufacturers.find(_manufacturer => _manufacturer.id === id);
        if (!manufacturer) {
            response.json({
                message: 'not found',
                valid: false,
            });
            return;
        }
        if (request.body.paid) {
            const now = new Date();
            manufacturer.last_paid = `${
                now.getUTCMonth() + 1
            }/${now.getUTCDate()}/${now.getUTCFullYear()}`;
        } else {
            const {
                activated,
                name,
                contact_name,
                contact_phone,
                contact_email,
                billing_email,
                invoice_amount,
                logo,
                website,
            } = request.body;
            Object.assign(manufacturer, {
                activated: activated === 'true',
                name,
                contact_name,
                contact_phone,
                contact_email,
                billing_email,
                invoice_amount,
                logo,
                website,
            });
        }
    }
    response.json({
        message: '',
        valid: true,
    });
});

app.get('/api/users.php', (request, response) => {
    const { query } = request;
    let relevantUsers = users;
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantUsers = relevantUsers.filter(user => user[searchCriteria].includes(searchTerm));
    }
    response.json(relevantUsers);
});

app.post('/api/users.php', (request, response) => {
    const { loginid, username, email } = request.body;
    const user = users.find(_users => _users.loginid === loginid);
    if (!user || !username || !email) {
        response.json({
            message: 'not found',
            valid: false,
        });
        return;
    }
    if (request.body.reset) {
        console.log(`reset password for user ${loginid}`);
    } else {
        const { activated } = request.body;
        Object.assign(user, {
            activated: activated === 'true' ? '1' : '0',
            username,
            email,
        });
    }
    response.json({
        message: '',
        valid: true,
    });
});
