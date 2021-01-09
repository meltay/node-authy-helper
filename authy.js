var config = require('./config');

const https = require('https');
var querystring = require('querystring');

var BASE_URL = config.BASE_URL;

if (process.env.NODE_ENV === 'test') {
    BASE_URL = config.TEST_BASE_URL
} else {
    BASE_URL = config.BASE_URL;
}

var BASE_URL_GET = 'https://' + BASE_URL;
var globalApiKey = null;

function authy(apiKey) {
    globalApiKey = apiKey;

    var globalGetOptions = {
        headers: {
            'X-Authy-API-Key': globalApiKey,
        }
    };

    return {
        createUser: async function (email, phone, countryCode) {
            let postOptions = {
                hostname: BASE_URL,
                path: '/protected/json/users/new',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Authy-API-Key': globalApiKey,
                }
            };
            let postData = querystring.stringify({
                'user[email]': email,
                'user[cellphone]': phone,
                'user[country_code]': countryCode
            });
            return postRequest(postOptions, postData);
        },
        sendSmsVerifyCode: async function (userAuthyId, force = false) {
            let url = BASE_URL_GET + '/protected/json/sms/' + userAuthyId + '?force=' + force;
            return getRequest(url);
        },
        verifySmsCode: async function (userAuthyId, code) {
            var result = {};
            let url = BASE_URL_GET + '/protected/json/verify/' + code + '/' + userAuthyId;
            return new Promise((resolve, reject) => {
                https.get(url, globalGetOptions, res => {
                    let response = ""
                    res.on("data", d => {
                        response += d
                    });
                    res.on("end", () => {
                        result = JSON.parse(response);
                        resolve(result);
                    });
                    res.on("error", (error) => {
                        result.success = false;
                        result.error = error;
                        reject(result);
                    });
                });
            });
        },
        sendPushAuthenticationRequest: async function (userAuthyId, pushMessage, pushDetails, hiddenDetails, logos = null, expireSecond) {
            let postOptions = {
                hostname: BASE_URL,
                path: '/onetouch/json/users/' + userAuthyId + '/approval_requests',
                method: 'POST',
                headers: {
                    'X-Authy-API-Key': globalApiKey,
                }
            };
            let postData = {
                message: pushMessage,
                details: pushDetails || {},
                hidden_details: hiddenDetails || {}
            };

            if (logos) {
                postData.logos = logos;
            }

            if (expireSecond) {
                postData.seconds_to_expire = expireSecond;
            }
            postData =  querystring.stringify(postData);
            return postRequest(postOptions, postData);
        },
        checkAuthenticationRequestStatus: async function (transactionId) {
            let url = BASE_URL_GET + '/onetouch/json/approval_requests/' + transactionId;
            return getRequest(url);
        },
        deleteUser: async function (userAuthyId, user_ip = '') {
            let postOptions = {
                hostname: BASE_URL,
                path: '/protected/json/users/' + userAuthyId + '/remove',
                method: 'POST',
                headers: {
                    'X-Authy-API-Key': globalApiKey,
                }
            };
            let postData = querystring.stringify({
                user_ip: user_ip
            });
            return postRequest(postOptions, postData);
        },
        getAppDetails: async function () {
            let url = BASE_URL_GET + '/protected/json/app/details'
            return getRequest(url);
        },
        getUserStatus: async function (userAuthyId) {
            let url = BASE_URL_GET + '/protected/json/users/' + userAuthyId + '/status'
            return getRequest(url);
        }
    }

    function postRequest (options, data) {
        let result = {};
        return new Promise((resolve, reject) => {
            https.request(options, res => {
                let response = ""
                res.on("data", d => {
                    response += d
                })
                res.on("end", () => {
                    result = JSON.parse(response);
                    resolve(result);
                })
                res.on("error", (error) => {
                    result.success = false;
                    result.error = error;
                    reject(result);
                })
            }).end(data);
        });
    }
    
    function getRequest (url) {
        let result = {};
        return new Promise((resolve, reject) => {
            https.get(url, globalGetOptions, res => {
                let response = ""
                res.on("data", d => {
                    response += d
                });
                res.on("end", () => {
                    result = JSON.parse(response);
                    resolve(result);
                });
                res.on("error", (error) => {
                    result.success = false;
                    result.error = error;
                    reject(result);
                });
            });
        });
    }
}

module.exports = function init(apiKey) {
    return authy(apiKey);
}