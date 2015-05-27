var tailor = require('api-tailor');

module.exports = function(config) {
  return tailor({
    host: config.host,
    resources: {
      users: require('./users'),
      'packages': require('./packages')
    }
  });
};