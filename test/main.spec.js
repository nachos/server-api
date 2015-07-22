'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('server-api', function () {
  describe('exports', function () {
    var serverApi = require('../lib');

    it('should expose an object', function () {
      expect(serverApi).to.be.an.object;
    });

    it('should have connect function', function () {
      expect(serverApi.connect).to.be.a.function;
    });

    it('should have connected function', function () {
      expect(serverApi.connected).to.be.a.function;
    });

    it('should have resources', function () {
      expect(serverApi.packages).to.be.a.function;
      expect(serverApi.users).to.be.a.function;
    });
  });

  describe('connect', function () {
  });
});