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
      expect(client.setToken).to.be.a('function');
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

      it('should reject strings', function () {
        expect(client.connect('hola')).to.eventually.be.rejectedWith(TypeError);
      });

      it('should reject numbers', function () {
        expect(client.connect(5)).to.eventually.be.rejectedWith(TypeError);
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
  });

  describe('connected', function () {
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

    it('should be false before connect', function () {
      expect(client.connected()).to.be.false;
    });

    it('should be true after connect', function () {
      return client.connect({email: 'test', password: 'test'})
        .then(function () {
          expect(client.connected()).to.be.true;
        });
    });
  });

  describe('setToken', function () {
    var client = require('../lib')();

    it('should change connected state', function () {
      expect(client.connected()).to.be.false;
      client.setToken('test');
      expect(client.connected()).to.be.true;
    });
  });

  describe('token injection', function () {
    var client;
    var options;

    before(function () {
      var apiTailorMock = function () {
        return {
          local: {
            login: sinon.stub().returns(Q.resolve({token: 'test'}))
          },
          inject: function (opts) {
            options = opts;
          }
        };
      };

      mockery.registerMock('api-tailor', apiTailorMock);

      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
    });

    beforeEach(function () {
      client = require('../lib')();
    });

    after(function () {
      mockery.deregisterMock('api-tailor');
      mockery.disable();
    });

    it('should inject interceptor', function () {
      expect(options).to.not.be.empty;
      expect(options.request).to.not.be.empty;
    });

    describe('without token', function () {
      it('should set json', function () {
        var request = {};

        options.request(request);
        expect(request.json).to.be.true;
        expect(request.headers).to.be.empty;
      });
    });

    describe('with token', function () {
      beforeEach(function () {
        client.setToken('test');
      });

      it('should put headers on request', function () {
        var request = {};

        options.request(request);
        expect(request.json).to.be.true;
        expect(request.headers).to.not.be.empty;
        expect(request.headers.Authorization).to.equal('Bearer test');
      });
    });
  });
});