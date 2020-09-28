
# Authy Verify API Helper For Node.JS

  

[![Build Status](https://travis-ci.org/meltay/node-authy-helper.svg?branch=master)](https://travis-ci.org/meltay/node-authy-helper)

   

[Official Authy documentation](https://www.twilio.com/docs/authy/api  "Officlial documentation")

  [Github](https://github.com/meltay/node-authy-helper)

## Installation

  

`npm i authy-helper --save`

  

## Usage

#### Authy Create User

```javascript

const  authy = require('authy-helper')('YOUR API KEY');

  

var  createSmsUserResult = await authy.createUser('test@test.com', '532999999', '90');
console.log(createSmsUserResult.user.id) // This is authyId of user

```

  

#### Authy Delete User

```javascript

const  authy = require('authy-helper')('YOUR API KEY');
var  createSmsUserResult = await authy.delete(userAuthyId);

```

  

#### Send Verify Code via Sms
```javascript
let force = true; // default value false.
let sendSmsResult = await authy.sendSmsVerifyCode(userAuthyId, force);
```
  

#### Verify Code

  

```javascript

let  verifySmsCodeResult = await authy.verifySmsCode(userAuthyId, code);

```

  

#### Send Push Authentication Request

```javascript

let  sendPushResultResult = await authy.sendPushAuthenticationRequest(
userAuthyId,

'This is test', // Push message title

{ // OPTIONAL

username: 'Meltay Berk',

location: 'Izmir'

},

{ // OPTIONAL

transaction_num: "TRAACCBB"

},

null, // Logo

120000  // Code expire time (second)

);

var  transactionId = sendPushResultResult.approval_request.uuid;

```

  

#### Check Push Authentication Request State

```javascript

let  status = await authy.checkAuthenticationRequestStatus(uuid);
console.log(status.approval_request.status); // pending, aproved, expired or denied

```

  

#### Test for Developer

  

`npm test`