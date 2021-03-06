'use strict';

var urljoin = require('url-join');
var tailor = require('api-tailor');
var nachosConfig = require('nachos-config');
var Q = require('q');
var debug = require('debug');
var resources = require('./resources');
var auth = require('./auth');

/**
 * Build a server api object
 *
 * @returns {Object} The server api
 */
module.exports = function () {
  var config = nachosConfig.getSync();

  debug('got config: %j', config);

  var client = tailor({
    host: urljoin(config.server, 'api'),
    resources: resources
  });

  var authClient = auth(config.server);

  var token;

  client.inject({
    request: function (request) {
      request.json = true;

      if (token) {
        request.headers = request.headers || {};
        request.headers.Authorization = 'Bearer ' + token;
      }

      return Q.resolve(request);
    }
  });

  /**
   *  Checks if a token is stored in memory
   *
   * @returns {boolean} Whether or not a token is stored in memory
   */
  client.connected = function () {
    return !!token;
  };

  /**
   * Set a new token
   *
   * @param {String} newToken the token to use in authentication
   */
  client.setToken = function (newToken) {
    token = newToken;
  };

  /**
   * Authenticate with the given parameters and save the token
   *
   * @param {Object} options The token or an email and password
   * @returns {Q.promise} The token
   */
  client.connect = function (options) {
    options = options || {};
    debug('connect options: %j', options);

    if (options.email && options.password) {
      return authClient.local.login({
        email: options.email,
        password: options.password
      })
        .then(function (data) {
          token = data.token;

          return Q.resolve(token);
        });
    }

    return Q.reject(new TypeError('Invalid options'));
  };

  return client;
};