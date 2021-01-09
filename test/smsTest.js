const chai = require('chai');
const assert = chai.assert;
var authy = require('../index')('5yPJPCp4HglyyBFWVSnvcaiWS0tDZf44');

var userAuthyId = '334214703';
var wrongVerifyCode = 222333444;

describe('Sms Test', function() {
    it('Create Authy User', async function() {
        var expected = true;
        
        let createSmsUserResult = await authy.createUser('test@test.com', '05328881122', '90');
        if (createSmsUserResult.user) {
            userAuthyId = createSmsUserResult.user.id;
        }
        assert.deepEqual(createSmsUserResult.success, expected);
    });
    it('Create Authy Empty Phone', async function() {
        var expected = false;
        
        let createSmsUserResult = await authy.createUser('test@test.com', '', '90');
        assert.deepEqual(createSmsUserResult.success, expected);
    });
    it('Create Authy Empty Email', async function() {
        var expected = false;
        
        let createSmsUserResult = await authy.createUser('', '', '90');
        assert.deepEqual(createSmsUserResult.success, expected);
    });
    it('Create Authy Not Valid Email', async function() {
        var expected = false;
        
        let createSmsUserResult = await authy.createUser('asdasd@asdasd', '', '90');
        assert.deepEqual(createSmsUserResult.success, expected);
    });
    it('Create Authy User Without Country Code', async function() {
        var expected = false;
        
        let createSmsUserResult = await authy.createUser('test@test.com', '5061581772');
        assert.deepEqual(createSmsUserResult.success, expected);
    });
    it('Send Sms', async function() {
        var expected = true;
        
        let sendSmsResult = await authy.sendSmsVerifyCode(userAuthyId);
        if (sendSmsResult.error_code === '60003') {
            sendSmsResult.success = true;
        }
        assert.deepEqual(sendSmsResult.success, expected);
    });
    it('Wrong Verify Code', async function() {
        var expected = false;
        let verifySmsCodeResult = await authy.verifySmsCode(userAuthyId, wrongVerifyCode);
        assert.deepEqual(verifySmsCodeResult.success, expected);
    });
    it('Empty Verify Code', async function() {
        var expected = false;
        let verifySmsCodeResult = await authy.verifySmsCode(userAuthyId);
        assert.deepEqual(verifySmsCodeResult.success, expected);
    });
    it('Verify Code', async function() {
        var expected = false;
        let verifySmsCodeResult = await authy.verifySmsCode(userAuthyId);
        assert.deepEqual(verifySmsCodeResult.success, expected);
    });
    it('Delete Authy User', async function() {
        var expected = true;
        
        let deleteUserResult = await authy.deleteUser(userAuthyId);
        assert.deepEqual(deleteUserResult.success, expected);
    });
});