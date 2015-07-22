'use strict';

var resources = require('./resources');
var urljoin = require('url-join');
var tailor = require('api-tailor');
var nachosConfig = require('nachos-config');
var request = require('request');
var Q = require('q');

module.exports = function () {
  var config = nachosConfig.getSync();

  var client = tailor({
    host: urljoin(config.server, 'api'),
    resources: resources
  });

  var token = config.token;

  function getToken() {
    if (token) {
      return Q.resolve(token);
    }

    return nachosConfig.get()
      .then(function (config) {
        if (config.token) {
          token = config.token;
        }

        return token;
      });
  }

  function setToken(newToken) {
    token = newToken;

    return nachosConfig.set({token: token})
      .then(function () {
        return true;
      });
  }

  function login(email, password) {
    var deferred = Q.defer();

    request.post({
        url: urljoin(config.server, 'auth', 'local'),
        json: {
          email: email,
          password: password
        }
      },
      function (err, response, body) {
        if (err) {
          deferred.reject(err);
        }
        else if (response.statusCode !== 200) {
          deferred.reject({response: response, body: body});
        }
        else {
          deferred.resolve(body.token);
        }
      });

    return deferred.promise;
  }

  client.inject({
    request: function (request) {
      request.json = true;

      return getToken()
        .then(function (token) {
          request.headers = request.headers || {};

          if (token) {
            request.headers.Authorization = 'Bearer ' + token;
          }

          return request;
        });
    }
  });

  client.connected = function () {
    return !!token;
  };

  client.connect = function (options) {
    options = options || {};

    if (options.token) {
      return setToken(options.token);
    }

    if (options.email && options.password) {
      return login(options.email, options.password)
        .then(function (token) {
          return setToken(token);
        });
    }

    return Q.resolve(false);
  };

  return client;
};