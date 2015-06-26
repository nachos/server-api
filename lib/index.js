'use strict';

var resources = require('./resources');
var urljoin = require('url-join');
var tailor = require('api-tailor');
var nachosConfig = require('nachos-config')();
var request = require('request');

module.exports = function () {
  var config = nachosConfig.getSync();

  var client = tailor({
    host: urljoin(config.server, 'api'),
    resources: resources
  });

  var token = config.token;

  function getToken(cb) {
    if (token) {
      return cb(null, token);
    }

    nachosConfig.get(function (err, config) {
      if (err) {
        return cb(err);
      }

      if (config.token) {
        token = config.token;

        return cb(null, token);
      }

      cb();
    });
  }

  function setToken(newToken, cb) {
    token = newToken;
    nachosConfig.set({token: token}, function (err) {
      if (err) {
        return cb(err);
      }

      cb(null, true);
    });
  }

  client.inject({
    request: function (request, cb) {
      getToken(function (err, token) {
        if (err) {
          return cb(err);
        }

        request.headers = request.headers || {};

        if (token) {
          request.headers.Authorization = 'Bearer ' + token;
        }

        cb(null, request);
      });
    }
  });

  client.connected = function () {
    return !!token;
  };

  client.connect = function (options, cb) {
    options = options || {};

    if (options.token) {
      setToken(options.token, cb);

      return;
    }

    if (options.email && options.password) {
      request.post({
          url: urljoin(config.server, 'auth', 'local'),
          json: {
            email: options.email,
            password: options.password
          }
        },
        function (err, response, body) {
          if (err) {
            return cb(err);
          }

          if (response.statusCode !== 200) {
            return cb({response: response, body: body});
          }

          setToken(body.token, cb);
        });

      return;
    }

    cb(null, false);
  };

  return client;
};