# server-api

Nachos server side api

<table>
  <thead>
    <tr>
      <th>Linux</th>
      <th>OSX</th>
      <th>Windows</th>
      <th>Coverage</th>
      <th>Dependencies</th>
      <th>DevDependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" align="center">
        <a href="https://travis-ci.org/nachos/server-api"><img src="https://img.shields.io/travis/nachos/server-api.svg?style=flat-square"></a>
      </td>
      <td align="center">
        <a href="https://ci.appveyor.com/project/nachos/server-api"><img src="https://img.shields.io/appveyor/ci/nachos/server-api.svg?style=flat-square"></a>
      </td>
      <td align="center">
<a href='https://coveralls.io/r/nachos/server-api'><img src='https://img.shields.io/coveralls/nachos/server-api.svg?style=flat-square' alt='Coverage Status' /></a>
      </td>
      <td align="center">
        <a href="https://david-dm.org/nachos/server-api"><img src="https://img.shields.io/david/nachos/server-api.svg?style=flat-square"></a>
      </td>
      <td align="center">
        <a href="https://david-dm.org/nachos/server-api#info=devDependencies"><img src="https://img.shields.io/david/dev/nachos/server-api.svg?style=flat-square"/></a>
      </td>
    </tr>
  </tbody>
</table>

## Have a problem? Come chat with us!
[![Join the chat at https://gitter.im/nachos/server-api](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nachos/server-api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation
``` bash
  $ [sudo] npm install server-api --save
```

## Usage
### Initialize
``` js
var server = require('server-api');
var client = server();
```

### Connecting
Connect to the server with email and password
``` js
client.connect({email:'nacho@nachos.io', password:'hola'})
  .then(function(token) {
    // token generated to authenticate - cached in memmory
  });
```

### Connected
Check if a token is cached
``` js
client.connected() // true or false
```

### Set token
Save a given token in cache
``` js
client.setToken('token');
```

### API
The package reflects all the api from the [nachos server](https://github.com/nachos/server)
#### Examples
``` js
client.users.me()
  .then(function(me) {
    // me - user data
  });
  
client.packages.all()
  .then(function(packages) {
    // packages - list of all packages
  });
```

Full documentation can be found [here](https://github.com/nachos/server/tree/master/server/api)

## Run Tests
``` bash
  $ npm test
```

## License

[MIT](LICENSE)
