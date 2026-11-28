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

// Columns searched with a case-insensitive "contains" match, like the real API. Every other
// column (the IDs) must match exactly.
const CONTAINS_COLUMNS = ['name', 'username', 'product_name', 'email'];

const matchesFilter = (row, column, term) => {
    const value = String(row[column] === undefined || row[column] === null ? '' : row[column]);
    if (CONTAINS_COLUMNS.includes(column)) {
        return value.toLowerCase().includes(String(term).toLowerCase());
    }
    return value === String(term);
};

// Define routes

app.get('/api/', (request, response) => {
    response.send('test');
});

app.get('/api/ping.php', (request, response) => {
    response.json({ message: 'pong' });
});

app.get('/api/stats.php', (request, response) => {
    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const countSince = (rows, column, days) =>
        rows.filter(row => now - new Date(row[column]).getTime() <= days * DAY).length;
    response.json({
        users: {
            total: users.length,
            active30: countSince(users, 'last_login', 30),
            active365: countSince(users, 'last_login', 365),
        },
        designs: {
            total: designs.length,
            created30: countSince(designs, 'created', 30),
            createdYear: countSince(designs, 'created', 365),
        },
    });
});

app.get('/api/designs.php', (request, response) => {
    const { query } = request;
    // Add the owner's username and the product's name, like the real API does.
    let relevantDesigns = designs.map(design => ({
        ...design,
        username: (users.find(user => user.loginid === design.user) || {}).username,
        product_name: (products.find(product => product.id === design.product) || {}).name,
    }));
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantDesigns = relevantDesigns.filter(design =>
            matchesFilter(design, searchCriteria, searchTerm)
        );
    }
    if (query.order) {
        const [column, direction] = query.order;
        const multiplier = String(direction).toUpperCase() === 'DESC' ? -1 : 1;
        relevantDesigns = [...relevantDesigns].sort((a, b) => {
            if (a[column] === b[column]) {
                return 0;
            }
            return (a[column] > b[column] ? 1 : -1) * multiplier;
        });
    }
    const total = relevantDesigns.length;
    if (query.limit) {
        const skip = Number(query.skip || 0);
        relevantDesigns = relevantDesigns.slice(skip, skip + Number(query.limit));
    }
    if (query.includeTotal) {
        response.json({ data: relevantDesigns, total });
        return;
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
    // Add the manufacturer's name, like the real API does.
    let relevantProducts = products.map(product => ({
        ...product,
        manufacturer_name: (
            manufacturers.find(manufacturer => manufacturer.id === product.manufacturer) || {}
        ).name,
    }));
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantProducts = relevantProducts.filter(product =>
            matchesFilter(product, searchCriteria, searchTerm)
        );
    }
    if (query.order) {
        const [column, direction] = query.order;
        const multiplier = String(direction).toUpperCase() === 'DESC' ? -1 : 1;
        const sortValue = product => {
            if (column === 'created') {
                return new Date(product.created).getTime();
            }
            if (column === 'manufacturer') {
                return Number(product.manufacturer);
            }
            return String(product[column]).toLowerCase();
        };
        relevantProducts = [...relevantProducts].sort((a, b) => {
            if (sortValue(a) === sortValue(b)) {
                // Break ties on id, newest first, like the real API.
                return Number(b.id) - Number(a.id);
            }
            return (sortValue(a) > sortValue(b) ? 1 : -1) * multiplier;
        });
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
    if (query.search) {
        const term = String(query.search).toLowerCase();
        relevantUsers = relevantUsers.filter(
            user => user.loginid === query.search || user.username.toLowerCase().includes(term)
        );
    }
    if (query.filter) {
        const filters = Object.entries(query.filter);
        const searchCriteria = filters[0][0];
        const searchTerm = filters[0][1];
        relevantUsers = relevantUsers.filter(user =>
            matchesFilter(user, searchCriteria, searchTerm)
        );
    }
    if (query.order) {
        const [column, direction] = query.order;
        const multiplier = String(direction).toUpperCase() === 'DESC' ? -1 : 1;
        // Dates are MM/DD/YYYY strings, so they need to be parsed to be compared.
        const sortValue = user => {
            if (column === 'create_time' || column === 'last_login') {
                return new Date(user[column]).getTime();
            }
            return String(user[column]).toLowerCase();
        };
        relevantUsers = [...relevantUsers].sort((a, b) => {
            if (sortValue(a) === sortValue(b)) {
                // Break ties on loginid, newest first, like the real API.
                return Number(b.loginid) - Number(a.loginid);
            }
            return (sortValue(a) > sortValue(b) ? 1 : -1) * multiplier;
        });
    }
    const total = relevantUsers.length;
    if (query.limit) {
        const skip = Number(query.skip || 0);
        relevantUsers = relevantUsers.slice(skip, skip + Number(query.limit));
    }
    if (query.includeTotal) {
        response.json({ data: relevantUsers, total });
        return;
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
