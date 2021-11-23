import axios from 'axios';
import { error, success } from 'react-watty-ui';
import env from '../constants/environmentVariables';
import { transformDesign } from '../models/Design';
import { transformProduct } from '../models/Product';

class KitePaintApi {
    constructor() {
        this.config = {
            baseURL: this.baseUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        this.axiosInstance = axios.create(this.config);
    }

    baseUrl = `${env.apiScheme}://${env.apiHost}${env.apiPort ? ':' : ''}${env.apiPort}${
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

    async getDesigns({ searchTerm, searchCriteria }) {
        let path =
            '/designs.php?limit=100&return=id&return=active&return=created&return=user&return=status&return=name&return=product&return=updated';
        if (searchTerm && searchCriteria) {
            path += `&filter[${searchCriteria}]=${searchTerm}`;
        }
        const response = await this.axiosInstance.get(path).catch(() => {
            error('Failed to get designs');
            return Promise.reject();
        });
        const transformedDesigns = response.data.map(transformDesign);
        return transformedDesigns;
    }

    async updateDesign(design) {
        const path = '/designs.php';
        let response;
        try {
            const bodyFormData = new FormData();
            const data = design.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
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

    async getProducts({ searchTerm, searchCriteria }) {
        let path =
            '/products.php?limit=100&return=id&return=created&return=embed&return=colors&return=manufacturer&return=name&return=notes&return=status&return=url&return=variations';
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
        try {
            const bodyFormData = new FormData();
            const data = product.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
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
        try {
            const bodyFormData = new FormData();
            const data = product.buildPayload();
            Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));
            bodyFormData.append('new', true);
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
}

const api = new KitePaintApi();
export default api;
