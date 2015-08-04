'use strict';

var chai = require('chai');
var expect = chai.expect;
var Q = require('q');
var sinon = require('sinon');
var mockery = require('mockery');

chai.use(require('chai-as-promised'));

describe('server-api', function () {
  describe('exports', function () {
    var serverApi = require('../lib');

    it('should expose a valid exports', function () {
      expect(serverApi).to.be.a('function');
    });

    it('client should expose valid exports', function () {
      var client = serverApi();

      expect(client.connected).to.be.a('function');
      expect(client.connect).to.be.a('function');
    });
  });

  describe('connect', function () {
    describe('without data', function () {
      var client = require('../lib')();

      it('should be rejected', function () {
        expect(client.connect()).to.eventually.be.rejectedWith(TypeError);
      });
    });

    describe('with invalid data', function () {
      var client = require('../lib')();

      it('should be rejected', function () {
        expect(client.connect({})).to.eventually.be.rejectedWith(TypeError);
      });
    });

    describe('with valid email and password', function () {
      var client;

      before(function () {
        var apiTailorMock = function () {
          return {
            local: {
              login: sinon.stub().returns(Q.resolve({token: 'test'}))
            },
            inject: sinon.stub().returns(Q.resolve())
          };
        };

        mockery.registerMock('api-tailor', apiTailorMock);

        mockery.enable({
          useCleanCache: true,
          warnOnReplace: false,
          warnOnUnregistered: false
        });

        client = require('../lib')();
      });

      after(function () {
        mockery.deregisterMock('api-tailor');
        mockery.disable();
      });

      it('should be resolved with token', function () {
        return expect(client.connect({email: 'test', password: 'test'})).to.eventually.equal('test');
      });
    });

    describe('with invalid email', function () {
      var client;

      before(function () {
        var apiTailorMock = function () {
          return {
            local: {
              login: sinon.stub().returns(Q.reject())
            },
            inject: sinon.stub().returns(Q.resolve())
          };
        };

        mockery.registerMock('api-tailor', apiTailorMock);

        mockery.enable({
          useCleanCache: true,
          warnOnReplace: false,
          warnOnUnregistered: false
        });

        client = require('../lib')();
      });

      after(function () {
        mockery.deregisterMock('api-tailor');
        mockery.disable();
      });

      it('should be resolved with statusCode 401', function () {
        return expect(client.connect({email: 'test', password: 'test'})).to.be.rejected;
      });
    });
  });
})
;