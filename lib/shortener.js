/**
 * shortener
 * https://github.com/tonymilne/shortener
 *
 * Copyright (c) 2012 Tony Milne
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var redis = require('redis');

var filename = path.join(__dirname, 'shorten.lua');
var script = fs.readFileSync(filename, 'utf8');

function Shortener(options) {
	options = options || {};

	var shortener = this;

	shortener.redis = options.redis || redis.createClient();
	shortener.sequenceKey = options.sequenceKey || 'shortener:sequence';
	shortener.hashKey = options.hashKey || 'shortener:hash';
}

/**
 * Add value to the shortener.
 * @param {string} value The value to add against the generateed slug.
 * @return slug
 */
Shortener.prototype.add = function(value, callback) {
	var shortener = this;

	// evalsha(shortener.sha1).
	// @NOTE: Apparanetly node-redis performs evalsha check/fallback to eval for unprimed script.
	shortener.redis.eval(script, 2, shortener.sequenceKey, shortener.hashKey, value, callback);
};

/**
 * Get the value matching the specified slug.
 */
Shortener.prototype.get = function(slug, callback) {
	var shortener = this;

	shortener.redis.hget(shortener.hashKey, slug, callback);
};

module.exports = Shortener;