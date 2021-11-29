import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

const User = createModel('User', {
    loginid: null,
    activated: null,
    create_time: null,
    username: null,
    email: null,
    last_login: null,

    buildPayload() {
        return {
            ...this.getProperties('loginid', 'username', 'email'),
            activated: this.get('activated') ? 'true' : 'false',
        };
    },
});

User.prototype.propTypes = {
    loginid: PropTypes.string,
    activated: PropTypes.bool,
    create_time: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    last_login: PropTypes.string,
};

export default User;

export function transformUser(rawUser) {
    const { loginid, activated, create_time, username, email, last_login } = rawUser;
    return new User({
        activated: activated === '1',
        loginid,
        create_time,
        username,
        email,
        last_login,
    });
}
