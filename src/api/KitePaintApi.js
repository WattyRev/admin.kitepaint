import axios from 'axios';
import { error, success } from 'react-watty-ui';
import env from '../constants/environmentVariables';
import { transformDesign } from '../models/Design';
import { transformProduct } from '../models/Product';
import { transformManufacturer } from '../models/Manufacturer';
import { transformUser } from '../models/User';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

function handleFailure(networkError) {
    const responseCode = networkError?.response?.status;
    if (responseCode === 401) {
        const { apiScheme, apiHost, apiPath } = env;
        window.location = `${apiScheme}://${apiHost}${apiPath}/login.php?returnUrl=${encodeURI(
            window.location.href
        )}`;
    }
}

class KitePaintApi {
    constructor() {
        this.config = {
            baseURL: this.baseUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Kp-Auth-Token': getCookie('Kp-Auth-Token'),
            },
        };

        this.axiosInstance = axios.create(this.config);
        this.axiosInstance.interceptors.response.use(undefined, handleFailure);
    }

    baseUrl = `${env.apiScheme}://${env.apiHost}${env.apiPort ? ':' : ''}${env.apiPort || ''}${
        env.apiPath
    }`;

    /**
     * The axios configuration.
     * @type {Object}
     */
    config = {};

    /**
     * The axios instance.
     * @type {Axios}
     */
    axiosInstance = null;

    ping() {
        const path = '/ping.php';
        return this.axiosInstance.get(path);
    }

    /**
     * Gets the counts shown on the dashboard.
     * @return {Promise<Object>} Counts: users {total, active30, active365} and designs {total,
     * created30, created60}
     */
    async getDashboardStats() {
        const response = await this.axiosInstance.get('/stats.php').catch(() => {
            error('Failed to get dashboard stats');
            return Promise.reject();
        });
        return response.data;
    }

    /**
     * Gets one page of designs.
     * @param {Object} options
     * @param {String} [options.searchTerm]
     * @param {String} [options.searchCriteria]
     * @param {String} [options.sortBy] The column to sort by
     * @param {String} [options.sortDirection] ASC or DESC
     * @param {Number} [options.page] The 1-based page number
     * @param {Number} [options.pageSize]
     * @return {Promise<{designs: Array, total: Number}>}
     */
    async getDesigns({
        searchTerm,
        searchCriteria,
        sortBy = 'created',
        sortDirection = 'DESC',
        page = 1,
        pageSize = 100,
    } = {}) {
        const skip = (page - 1) * pageSize;
        let path = `/designs.php?limit=${pageSize}&skip=${skip}&includeTotal=1&order%5B%5D=${encodeURIComponent(
            sortBy
        )}&order%5B%5D=${encodeURIComponent(
            sortDirection
        )}&return%5B%5D=id&return%5B%5D=active&return%5B%5D=created&return%5B%5D=user&return%5B%5D=status&return%5B%5D=name&return%5B%5D=product&return%5B%5D=updated&return%5B%5D=username&return%5B%5D=product_name`;
        if (searchTerm && searchCriteria) {
            path += `&filter[${searchCriteria}]=${searchTerm}`;
        }
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to get designs');
            return Promise.reject();
        });
        // Older API deployments return a bare array instead of { data, total }.
        const rows = Array.isArray(response.data) ? response.data : response.data.data;
        const total = Array.isArray(response.data) ? rows.length : response.data.total;
        return {
            designs: rows.map(transformDesign),
            total,
        };
    }

    async updateDesign(design) {
        const path = '/designs.php';
        let response;
        const bodyFormData = new FormData();
        const data = design.buildPayload();
        Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
        try {
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save design');
            throw e;
        }
        success('Design saved');
    }

    /**
     * Gets products.
     * @param {Object} options
     * @param {String} [options.searchTerm]
     * @param {String} [options.searchCriteria]
     * @param {String} [options.sortBy] The column to sort by
     * @param {String} [options.sortDirection] ASC or DESC
     * @return {Promise<Product[]>}
     */
    async getProducts({ searchTerm, searchCriteria, sortBy = 'created', sortDirection = 'DESC' }) {
        let path = `/products.php?limit=100&order%5B%5D=${encodeURIComponent(
            sortBy
        )}&order%5B%5D=${encodeURIComponent(
            sortDirection
        )}&return%5B%5D=id&return%5B%5D=created&return%5B%5D=embed&return%5B%5D=colors&return%5B%5D=manufacturer&return%5B%5D=manufacturer_name&return%5B%5D=name&return%5B%5D=notes&return%5B%5D=status&return%5B%5D=url&return%5B%5D=variations`;
        if (searchTerm && searchCriteria) {
            path += `&filter[${searchCriteria}]=${searchTerm}`;
        }
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to get products');
            return Promise.reject();
        });
        const transformedProducts = response.data.map(transformProduct);
        return transformedProducts;
    }

    async updateProduct(product) {
        const path = '/products.php';
        let response;
        const bodyFormData = new FormData();
        const data = product.buildPayload();
        Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
        try {
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save product');
            throw e;
        }
        success('Product saved');
    }

    async createProduct(product) {
        const path = '/products.php';
        let response;
        const bodyFormData = new FormData();
        const data = product.buildPayload();
        Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
        bodyFormData.append('new', true);
        try {
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save product');
            throw e;
        }
        success('Product saved');
    }

    async getManufacturers() {
        const path = '/manufacturers.php?get=1';
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to get manufacturers');
            return Promise.reject();
        });
        const transformedManufacturers = response.data.map(transformManufacturer);
        return transformedManufacturers;
    }

    async updateManufacturer(manufacturer) {
        const path = '/manufacturers.php';
        let response;
        try {
            const bodyFormData = new FormData();
            const data = manufacturer.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save manufacturer');
            throw e;
        }
        success('Manufacturer saved');
    }

    async payManufacturerInvoice(manufacturer) {
        const path = '/manufacturers.php';
        let response;
        try {
            const bodyFormData = new FormData();
            const data = {
                id: manufacturer.get('id'),
                paid: true,
            };
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to pay invoice');
            throw e;
        }
        success('Invoice marked as payed');
    }

    async createManufacturer(manufacturer) {
        const path = '/manufacturers.php';
        let response;
        try {
            const bodyFormData = new FormData();
            const data = manufacturer.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
            bodyFormData.append('new', true);
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save manufacturer');
            throw e;
        }
        success('Manufacturer saved');
    }

    /**
     * Gets one page of users.
     * @param {Object} options
     * @param {String} [options.searchTerm]
     * @param {String} [options.searchCriteria]
     * @param {String} [options.sortBy] The column to sort by
     * @param {String} [options.sortDirection] ASC or DESC
     * @param {Number} [options.page] The 1-based page number
     * @param {Number} [options.pageSize]
     * @return {Promise<{users: Array, total: Number}>}
     */
    async getUsers({
        searchTerm,
        searchCriteria,
        sortBy = 'last_login',
        sortDirection = 'DESC',
        page = 1,
        pageSize = 100,
    } = {}) {
        const skip = (page - 1) * pageSize;
        let path = `/users.php?limit=${pageSize}&skip=${skip}&includeTotal=1&order%5B%5D=${encodeURIComponent(
            sortBy
        )}&order%5B%5D=${encodeURIComponent(
            sortDirection
        )}&return%5B%5D=loginid&return%5B%5D=username&return%5B%5D=create_time&return%5B%5D=last_login&return%5B%5D=email&return%5B%5D=activated`;
        if (searchTerm && searchCriteria) {
            path += `&filter[${searchCriteria}]=${searchTerm}`;
        }
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to get users');
            return Promise.reject();
        });
        // Older API deployments return a bare array instead of { data, total }.
        const rows = Array.isArray(response.data) ? response.data : response.data.data;
        const total = Array.isArray(response.data) ? rows.length : response.data.total;
        return {
            users: rows.map(transformUser),
            total,
        };
    }

    /**
     * Finds users whose loginid is exactly the term or whose username contains it.
     * @param {String} term
     * @param {Number} [limit]
     * @return {Promise<User[]>}
     */
    async searchUsers(term, limit = 20) {
        const path = `/users.php?return%5B%5D=loginid&return%5B%5D=username&limit=${limit}&search=${encodeURIComponent(
            term
        )}`;
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to search users');
            return Promise.reject();
        });
        return response.data.map(transformUser);
    }

    async updateUser(user) {
        const path = '/users.php';
        let response;
        try {
            const bodyFormData = new FormData();
            const data = user.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to save user');
            throw e;
        }
        success('User saved');
    }

    async resetUserPassword(user) {
        const path = '/users.php';
        let response;
        const bodyFormData = new FormData();
        const data = {
            reset: true,
            ...user.getProperties('loginid', 'username', 'email'),
        };
        Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
        try {
            response = await this.axiosInstance.post(path, bodyFormData);
            if (!response?.data?.valid) {
                throw new Error('Request is invalid');
            }
        } catch (e) {
            error('Failed to reset password');
            throw e;
        }
        success("User's password has been reset");
    }
}

const api = new KitePaintApi();
export default api;
