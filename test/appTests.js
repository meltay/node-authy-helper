const chai = require('chai');
const assert = chai.assert;
var authy = require('../index')('1mz1nMrzJvrYpVezxB66t1n7Qvwflop0');

describe('App Test', function() {
    it('Get App Detail Test', async function() {
        let appDetails = await authy.getAppDetails();
        assert.deepEqual(appDetails.app.name, 'sandbox-meltay');
    });
    it('Get User Status', async function() {
        let userDetails = await authy.getUserStatus('295908957');
        assert.deepEqual(userDetails.success, true);
    });
});