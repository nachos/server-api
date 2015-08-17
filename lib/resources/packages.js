'use strict';

module.exports = {
  all: {
    method: 'GET',
    path: '/'
  },
  byName: {
    method: 'GET',
    path: '/:package'
  },
  add: {
    method: 'POST',
    path: '/'
  },
  download: {
    method: 'GET',
    path: '/:package/tarball',
    stream: true
  },
  upload: {
    method: 'POST',
    path: '/:package/tarball',
    data: 'form'
  }
};