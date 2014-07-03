var filters = require('lib/matcher.js');
var countries = require('test/data/countries.js');

var suggestions = filters.match('aus', countries, {keys: ['name']});

console.log(suggestions);