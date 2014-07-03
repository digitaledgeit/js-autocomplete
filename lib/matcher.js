
/**
 * Return suggestions which match the query
 * @param   {String}                query                       The query
 * @param   {Array.<String|Object>} suggestions                 The suggestions
 * @param   {Object}                [options]                   The options
 * @param   {Number}                [options.limit]             The maximum number of suggestions to return
 * @param   {Boolean}               [options.ignore_case]       Whether matching is case sensitive
 * @param   {Array.<String>}        [options.properties]        The properties to match on (required if suggestions are an object)
 * @returns {Function}
 */
function match(query, suggestions, options) {
	var matches = [];
	options             = options || {};
	options.ignore_case = typeof options.ignore_case === 'undefined' ? true : options.ignore_case;

	//check if we can ignore the case
	if (options.ignore_case) {
		query = query.toLowerCase();
	}

	for (var i=0; i<suggestions.length; ++i) {

		var
			matched     = false,
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
				if (value.indexOf(query) !== -1) {
					matched = true;
					break;
				}

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
			if (suggestion.indexOf(query) !== -1) {
				matched = true;
			}

		}

		if (matched) {

			//add the suggestion
			matches.push(suggestions[i]);

			//check if we've hit the suggestion limit
			if (typeof options.limit === 'number' && matches.length >= options.limit) {
				break;
			}

		}

	}

	return matches;
};

module.exports = function(suggestions, options) {
	return function(query) {
		return matcher.match(query, suggestions, options);
	}
};

module.exports.match = match;