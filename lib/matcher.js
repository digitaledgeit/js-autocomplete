
/**
 * Return suggestions which match the query
 * @param   {string}                query                       The query
 * @param   {Array.<String|Object>} suggestions                 The suggestions
 * @param   {Object}                [options]                   The options
 * @param   {number}                [options.limit]             The maximum number of suggestions to return
 * @param   {boolean}               [options.ignore_case]       Whether matching is case sensitive
 * @param   {boolean}               [options.relevance]         Whether the matches should be sorted by relevance
 * @param   {Array.<String>}        [options.properties]        The properties to match on (required if suggestions are an object)
 * @returns {Array.<String|Object>}
 */
function match(query, suggestions, options) {
	var matched = 0,matches = [];
	options             = options || {};
	options.ignore_case = typeof options.ignore_case === 'undefined' ? true : options.ignore_case;
	options.relevance = options.relevance || true;

	//check if we can ignore the case
	if (options.ignore_case) {
		query = query.toLowerCase();
	}

	for (var i=0; i<suggestions.length; ++i) {

		var
			foundAt     = 0,
			suggestion  = suggestions[i]
		;

		if (options.properties) {

			for (var j=0; j<options.properties.length; ++j) {

				var
					prop    = options.properties[j],
					value   = suggestion[prop]
				;

				//check if we can ignore the case
				if (options.ignore_case) {
					value = value.toLowerCase();
				}

				//check if the suggestion matches the query
				foundAt = value.indexOf(query);

			}

		} else {

			if (typeof suggestion !== 'string') {
				throw new Error('Please specify which properties you wish to match on in `options.properties`.')
			}

			//check if we can ignore the case
			if (options.ignore_case) {
				suggestion = suggestion.toLowerCase();
			}

			//check if the suggestion matches the query
			foundAt = suggestion.indexOf(query);

		}

		if (foundAt !== -1) {
			++matched;

			//add the suggestion
			if (options.relevance) { //TODO: take into account number of occurrences too
				if (matches[foundAt]) {
					matches[foundAt].push(suggestions[i]);
				} else {
					matches[foundAt] = [suggestions[i]];
				}
			}

			//check if we've hit the suggestion limit
			if (typeof(options.limit) === 'number' && matched >= options.limit) {
				break;
			}

		}

	}

	if (options.relevance) {
		matches = matches.reduce(function(a, b) {
			return a.concat(b);
		});
	}

	return matches;
};

module.exports = function(suggestions, options) {
	return function(query) {
		return match(query, suggestions, options);
	}
};

module.exports.match = match;
