/**
 * Shortener Test.
 */

var assert = require('assert');
var should = require('should');
var step = require('step');

var redis = require('redis');
var redisClient = redis.createClient();

var Shortener = require('../lib/shortener');
var shortener = new Shortener({
	sequenceKey: 'shortener-test:sequence',
	hashKey: 'shortener-test:hash'
});

describe('Shortener', function() {

	/**
	 * Clean up any keys used by the test before and after the test.
	 */
	function removeRedisTestKeys(callback) {
		redisClient.del(shortener.sequenceKey, shortener.hashKey, callback);
	}

	before(removeRedisTestKeys);
	after(removeRedisTestKeys);

	describe('#add()', function() {

		it('should store the specified value and return the generated slug it was stored against', function(done) {
			var url = 'http://inlight.com.au';

			shortener.add(url, function(err, slug) {
				if (err) {
					return done(err);
				}

				// The first url slug will be "1".
				slug.should.equal('1');

				done();
			});
		});

		it('should return predictable slug based on the current sequence value', function(done) {
			// Set the sequenceKey to "910", so that when a new url is added it's int value will be 911.
			// This test allows us to be confident in our Lua base60 implementation.
			step(
				function() {
					redisClient.set(shortener.sequenceKey, 910, this);
				},
				function(err) {
					if (err) {
						return done(err);
					}
					shortener.add('http://example.com.au', function(err, slug) {
						if (err) {
							return done(err);
						}

						slug.should.equal('FB'); // 911 --> FB in base60.
						done();
					});
				}
			);
		});

	});

	describe('#get()', function() {

		it('should return the value stored against the specified slug', function(done) {
			var slug = '1';

			shortener.get(slug, function(err, value) {
				if (err) {
					return done(err);
				}

				// The value stored against the slug.
				value.should.equal('http://inlight.com.au');

				done();
			});
		});
	});

});