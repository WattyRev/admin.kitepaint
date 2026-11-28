import env from './environmentVariables';

const BETA_SITE_HOST = 'beta.kitepaint.com';

/**
 * Gets the host of the public site that matches the API host, e.g. api.beta.kitepaint.com ->
 * beta.kitepaint.com. Anything that isn't an api.* host (such as localhost) uses the beta site.
 * @param {String} apiHost
 * @return {String}
 */
export function getSiteHost(apiHost) {
    if (typeof apiHost === 'string' && apiHost.startsWith('api.')) {
        return apiHost.slice('api.'.length);
    }
    return BETA_SITE_HOST;
}

/**
 * Gets the URL where a design can be viewed on the public site.
 * @param {String} designId
 * @param {String} [apiHost] Defaults to the API host of the current environment
 * @return {String}
 */
export default function getDesignViewUrl(designId, apiHost = env.apiHost) {
    return `https://${getSiteHost(apiHost)}/view/${encodeURIComponent(designId)}`;
}
