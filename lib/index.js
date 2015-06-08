var tailor = require('api-tailor');
var nachosConfig = require('nachos-config')();
var urljoin = require('url-join');

var buildTailor = function (options) {
  return tailor({
    host: urljoin(options.host, 'api'),
    resources: {
      users: require('./users'),
      'packages': require('./packages')
    }
  })
};

module.exports = function (callback) {
  nachosConfig.get(function (err, data) {
    if (err) {
      return callback(err);
    }

    callback(null, buildTailor({
      host: data.server
    }));
  });
};

module.exports.sync = function () {
  var config = nachosConfig.getSync();

  return buildTailor({
    host: config.server
  });
};