import axios from 'axios';
import env from '../constants/environmentVariables';
import { transformDesign } from '../models/Design';

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

    async getDesigns() {
        const response = await this.axiosInstance.get(
            '/designs.php?limit=100&return=id&return=active&return=created&return=user&return=status&return=name&return=product&return=updated'
        );
        const transformedDesigns = response.data.map(transformDesign);
        return transformedDesigns;
    }
}

const api = new KitePaintApi();
export default api;
