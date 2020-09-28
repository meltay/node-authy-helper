var config = require('./config');
const axios = require('axios').default;
const qs = require('querystring');

var BASE_URL;

if (process.env.NODE_ENV === 'test') {
    BASE_URL = config.TEST_BASE_URL
} else {
    BASE_URL = config.BASE_URL;
}

function authy (apiKey) {
    axios.defaults.headers.common['X-Authy-API-Key'] = apiKey;

    return {
        createUser: async function (email, phone, countryCode) {
            let url = BASE_URL + '/protected/json/users/new';
            try {
                let response = await axios.post(url,
                    qs.stringify({
                        'user[email]': email,
                        'user[cellphone]': phone,
                        'user[country_code]': countryCode
                    }), {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                );
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        sendSmsVerifyCode: async function (userAuthyId, force = false) {
            let url = BASE_URL + '/protected/json/sms/' + userAuthyId + '?force=' + force;
            try {
                let response = await axios.get(url);
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        verifySmsCode: async function (userAuthyId, code) {
            let url = BASE_URL + '/protected/json/verify/' + code + '/' + userAuthyId;
            try {
                let response = await axios.get(url);
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        sendPushAuthenticationRequest: async function(userAuthyId, pushMessage, pushDetails, hiddenDetails, logos = null, expireSecond) {
            let payload = {
                message: pushMessage,
                details: pushDetails || {},
                hidden_details: hiddenDetails || {}
            }

            if (logos) {
                payload.logos = logos;
            }

            if (expireSecond) {
                payload.seconds_to_expire = expireSecond;
            }

            let url = BASE_URL + '/onetouch/json/users/' + userAuthyId + '/approval_requests';
            try {
                let response = await axios.post(url, payload);
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        checkAuthenticationRequestStatus: async function (transactionId) {
            let url = BASE_URL + '/onetouch/json/approval_requests/' + transactionId;
            try {
                let response = await axios.get(url);
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        deleteUser: async function (userAuthyId, user_ip = '') {
            let url = BASE_URL + '/protected/json/users/' + userAuthyId + '/remove ';
            try {
                let response = await axios.post(url,
                    { 
                        user_ip: user_ip
                    }
                );
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        }
    }
}

module.exports = function init (apiKey) {
    return authy(apiKey);
}