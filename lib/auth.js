'use strict';

var tailor = require('api-tailor');
var urljoin = require('url-join');

/**
 * Build an api tailor for the auth api
 * @param host The host address
 * @returns {Object} auth api client
 */
module.exports = function (host) {
  return tailor({
    host: urljoin(host, 'auth'),
    resources: {
      local: {
        login: {
          method: 'POST',
          path: '/'
        }
      }
    }
  });
};