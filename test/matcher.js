var assert      = require('assert');
var matcher     = require('autosuggest/lib/matcher.js');

//test data
var people      = ['Steve Jobs', 'Bill Gates', 'Martin Fowler', 'Kent Beck'];
var countries   = require('autosuggest/test/data/countries.js');

describe('matcher', function() {
	describe('.match()', function() {

		it('should match', function() {
			var options = {ignore_case: false};

			var suggestions = matcher.match('b', people, options);
			assert.equal(1, suggestions.length);
			assert.equal('Steve Jobs', suggestions[0]);

			var suggestions = matcher.match('kent', people, options);
			assert.equal(0, suggestions.length);

		});

		it('should ignore case and match', function() {

			var suggestions = matcher.match('b', people);
			assert.equal(3, suggestions.length);
			assert.equal('Steve Jobs', suggestions[0]);
			assert.equal('Bill Gates', suggestions[1]);

			var suggestions = matcher.match('kent', people);
			assert.equal(1, suggestions.length);
			assert.equal('Kent Beck', suggestions[0]);

		});

		it('should ignore case, match and limit the number of suggestions returned', function() {
			var options = {limit: 2};

			var suggestions = matcher.match('b', people, options);
			assert.equal(2, suggestions.length);
			assert.equal('Steve Jobs', suggestions[0]);
			assert.equal('Bill Gates', suggestions[1]);

			var suggestions = matcher.match('kent', people, options);
			assert.equal(1, suggestions.length);
			assert.equal('Kent Beck', suggestions[0]);

		});

		it('should match .name', function() {
			var options = {properties: ['name'], ignore_case: false};

			var suggestions = matcher.match('Am', countries, options);
			assert.equal(1, suggestions.length);
			assert.equal('American Samoa', suggestions[0].name);

			var suggestions = matcher.match('aus', countries, options);
			assert.equal(0, suggestions.length);

		});

		it('should ignore case and match .name', function() {
			var options = {properties: ['name']};

			var suggestions = matcher.match('Am', countries, options);
			assert.equal(17, suggestions.length);
			assert.equal('American Samoa', suggestions[0].name);
			assert.equal('Bahamas', suggestions[1].name);

			var suggestions = matcher.match('aus', countries, options);
			assert.equal(2, suggestions.length);
			assert.equal('Australia', suggestions[0].name);
			assert.equal('Austria', suggestions[1].name);

		});

		it('should ignore case, match .name and limit the number of suggestions returned', function() {
			var options = {properties: ['name'], limit: 2};

			var suggestions = matcher.match('Am', countries, options);
			assert.equal(2, suggestions.length);
			assert.equal('American Samoa', suggestions[0].name);
			assert.equal('Bahamas', suggestions[1].name);

			var suggestions = matcher.match('aus', countries, options);
			assert.equal(2, suggestions.length);
			assert.equal('Australia', suggestions[0].name);
			assert.equal('Austria', suggestions[1].name);

		});

	});
});