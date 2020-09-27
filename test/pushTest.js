const chai = require('chai');
const assert = chai.assert;
var authy = require('../index')('1mz1nMrzJvrYpVezxB66t1n7Qvwflop0');

var userAuthyId = '295908957';
var uuid;

describe('Push Test', function() {
    it('Send Push Request', async function() {
        var expected = true;
        
        let sendPushResultResult = await authy.sendPushAuthenticationRequest(
            userAuthyId, 
            'This is test', 
            {
            username: 'Meltay Berk',
            location: 'Izmir'
            }, 
            {
                transaction_num: "TRAACCBB"
            },
            null,
            120000
        );
        uuid = sendPushResultResult.approval_request.uuid;
        assert.deepEqual(sendPushResultResult.success, expected);
    });
    it('Send Push Request Wrong AuthyId', async function() {
        var expected = false;
        
        let sendPushResultResult = await authy.sendPushAuthenticationRequest(
            '123123123', 
            'This is test', 
            {
            username: 'Meltay Berk',
            location: 'Izmir'
            }, 
            {
                transaction_num: "TRAACCBB"
            },
            null,
            120000
        );
        assert.deepEqual(sendPushResultResult.success, expected);
    });
    it('Check Push Request Expire Time', async function() {
        var expected = 120000;
        
        let status = await authy.checkAuthenticationRequestStatus(uuid);
        assert.deepEqual(status.approval_request.seconds_to_expire, expected);
    });
    it('Check Push Request Pending Status', async function() {
        var expected = 'pending';
        let status = await authy.checkAuthenticationRequestStatus(uuid);
        assert.deepEqual(status.approval_request.status, expected);
    });
});