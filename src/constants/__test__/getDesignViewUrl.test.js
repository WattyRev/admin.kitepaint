import getDesignViewUrl, { getSiteHost } from '../getDesignViewUrl';

describe('getSiteHost', () => {
    it('uses the beta site for the beta API', () => {
        expect.assertions(1);
        expect(getSiteHost('api.beta.kitepaint.com')).toBe('beta.kitepaint.com');
    });
    it('uses the production site for the production API', () => {
        expect.assertions(1);
        expect(getSiteHost('api.kitepaint.com')).toBe('kitepaint.com');
    });
    it('uses the beta site when running locally', () => {
        expect.assertions(1);
        expect(getSiteHost('localhost')).toBe('beta.kitepaint.com');
    });
    it('uses the beta site when there is no API host', () => {
        expect.assertions(1);
        expect(getSiteHost(undefined)).toBe('beta.kitepaint.com');
    });
});

describe('getDesignViewUrl', () => {
    it('builds a beta url', () => {
        expect.assertions(1);
        expect(getDesignViewUrl('1348', 'api.beta.kitepaint.com')).toBe(
            'https://beta.kitepaint.com/view/1348'
        );
    });
    it('builds a production url', () => {
        expect.assertions(1);
        expect(getDesignViewUrl('1348', 'api.kitepaint.com')).toBe(
            'https://kitepaint.com/view/1348'
        );
    });
    it('encodes the design id', () => {
        expect.assertions(1);
        expect(getDesignViewUrl('a/b', 'api.kitepaint.com')).toBe(
            'https://kitepaint.com/view/a%2Fb'
        );
    });
});
