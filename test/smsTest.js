const chai = require('chai');
const assert = chai.assert;
var authy = require('../index')('1mz1nMrzJvrYpVezxB66t1n7Qvwflop0');

var userAuthyId;
var wrongVerifyCode = 222333444;

describe('Sms Test', function() {
    it('Create Authy User', async function() {
        var expected = true;
        
        let createSmsUserResult = await authy.createUser('test@test.com', '532999999', '90');
        userAuthyId = createSmsUserResult.user.id;
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
});