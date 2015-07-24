'use strict';

var resources = require('./resources');
var urljoin = require('url-join');
var tailor = require('api-tailor');
var nachosConfig = require('nachos-config');
var Q = require('q');
var debug = require('debug');

module.exports = function () {
  var config = nachosConfig.getSync();

  debug('got config: %j', config);

  var client = tailor({
    host: urljoin(config.server, 'api'),
    resources: resources
  });

  var token;

  var setToken = function (newToken) {
    token = newToken;
  };

  client.inject({
    request: function (request) {
      request.json = true;
      request.headers = request.headers || {};

      if (token) {
        request.headers.Authorization = 'Bearer ' + token;
      }

      return Q.resolve(request);
    }
  });

  client.connected = function () {
    return !!token;
  };

  client.connect = function (options) {
    options = options || {};
    debug('connect options: %j', options);

    if (options.token) {
      setToken(options.token);

      return Q.resolve();
    }

    if (options.email && options.password) {
      return client.users.login({ email: options.email, password: options.password })
        .then(function (data) {
          setToken(data.token);

          return Q.resolve(true);
        });
    }

    return Q.resolve(false);
  };

  return client;
};