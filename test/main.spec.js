'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('server-api', function () {
  describe('exports', function () {
    var serverApi = require('../lib');

    it('should expose an object', function () {
      return expect(serverApi).to.be.an.object;
    });

    it('should have connect function', function () {
      return expect(serverApi.connect).to.be.a.function;
    });

    it('should have connected function', function () {
      return expect(serverApi.connected).to.be.a.function;
    });
  });

  describe('connect', function () {
  });
});