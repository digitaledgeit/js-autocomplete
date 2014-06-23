var emitter     = require('emitter');
var InputView   = require('./InputView');

/**
 * Presenter
 * @param   {object}                                        options             The options
 * @param   {array|function(string, function(*, array))}    options.source      A suggestion source
 * @param   {string|function(*)}                            [options.display]   A key or function used to convert the suggestion to a string
 * @constructor
 */
function Presenter(options) {
	var self = this;

	/**
	 * A suggestion data source
	 *  - an array of suggestions OR
	 *  - a function that will retrieve an array of suggestions
	 * @type {array|function(string, function(*, array))}
	 */
	this.source = options && options.source || [];

	/**
	 * A property key or function to return the suggestion display value
	 *  - the property or method name
	 *  - a function to extract the display value
	 * @type {string|function(*)}
	 */
	this.display = options && options.display || 'toString';

	/**
	 * The minimum number of characters a user query must be before any suggestions are fetched
	 * @type {int}
	 */
	this.minLength = options && typeof options.minLength !== 'undefined' ? options.minLength : 3;

	/**
	 * Whether the drop-down-menu should be visible when there are no suggestions
	 * @type {bool}
	 */
	this.hideDropDownIfEmpty = options && typeof options.hideDropDownIfEmpty !== 'undefined' ? options.hideDropDownIfEmpty : true;

	this.inputView              = options.inputView;
	this.dropDownView           = options.dropDownView;
	this.listView               = this.dropDownView.getList();
	this.listItemViewFactory    = options.listItemViewFactory;

	/**
	 * The timeout
	 * @type    {integer}
	 */
	this.timeout;

	// === bind events ===

	this.inputView.on('change', function() {
		self.suggest();
		self.emit('change');
	});
	this.inputView.on('focus', function() {
		if (!self._completing) {
			self.suggest()
		}
	});
	this.inputView.on('blur', function() {
		setTimeout(function() { //FIXME: wait for the click event to fire before hiding the list
			self.dropDownView.setVisible(false);
		}, 200)
	});

	this.inputView.on('key', function (key) {
		if (self.dropDownView.isVisible()) {
			switch (key) {

				case InputView.KEY_UP:
					if (self.listView.count() > 0) {
						if (self.listView.getSelectedIndex() === null) {
							self.listView.select(self.listView.count() - 1);
						} else if (self.listView.hasPrevious()) {
							self.listView.selectPrevious()
						}	
					}
					break;

				case InputView.KEY_DOWN:
					if (self.listView.count() > 0) {
						if (self.listView.getSelectedIndex() === null) {
							self.listView.select(0);
						} else if (self.listView.hasNext()) {
							self.listView.selectNext()
						}
					}
					break;

				case InputView.KEY_ENTER:
					self.complete();
					break;

			}
		}
	});

	this.listView.on('proxied:select', function(view) {
		self.listView.select(self.listView.indexOf(view));
		self.complete();
	});

	//insert the list after the input
	this.inputView.el.parentNode.insertBefore(this.dropDownView.el, this.dropDownView.el.nextSibling);
}
emitter(Presenter.prototype);

/**
 * Fetch suggestions for the query
 * @private
 * @param   {String}    query
 * @param   {Function}  callback
 */
Presenter.prototype.fetch = function(query, callback) {
	if (typeof this.source === 'function') {
		if (this.source.length === 2) {
			this.source(query, callback);
		} else {
			callback(this.source(query));
		}
	} else {
		callback(this.source);
	}
};

/**
 * Populate the list of solutions
 * @private
 * @param   {array}   suggestions
 */
Presenter.prototype.populate = function(suggestions) {
	this.suggestions = suggestions;

	this.listView.removeAll();

	for (var i = 0; i < suggestions.length; ++i) {
		var listItemView = this.listItemViewFactory('the-query', suggestions[i]);
		this.listView.append(listItemView);
	}

	if (this.hideDropDownIfEmpty && suggestions.length == 0) {
		this.dropDownView.setVisible(false);
	} else {
		this.dropDownView.setVisible(true);
	}

	return this;
};

/**
 * Suggest items based on the query string
 * @returns {exports}
 */
Presenter.prototype.suggest = function() {
	var self    = this;
	var query   = self.inputView.getValue();

	//ensure the query is longer than the minimum length
	if (query.length < this.minLength) {
		self.dropDownView.setVisible(false);
		return self;
	}

	//ensure the query is different to the previous
	if (query === this.query) {
		self.dropDownView.setVisible(true); //TODO: logic
		return self;
	}

	//wait till the user stops typing
	window.clearTimeout(this.timeout);
	this.timeout = window.setTimeout(function() {

		//fetch and display the suggestions
		self.fetch(query, function(suggestions) {
			self.emit('suggest', suggestions);
			self.populate(suggestions);
			self.query = query;
		});

	}, 250);

	return self;
};

/**
 * Complete the selected suggestion
 * @returns {exports}
 */
Presenter.prototype.complete = function() {
	if (this.dropDownView.isVisible()) {

		this.dropDownView.setVisible(false);

		if (this.listView.getSelectedIndex() !== null) {

			//get the suggestion object
			var suggestion = this.suggestions[this.listView.getSelectedIndex()];

			//get the suggestion display
			var display;
			if (typeof this.display === 'function') {
				display = this.display(suggestion);
			} else if (typeof this.display === 'string') {
				display = suggestion[this.display];
			} else {
				display = suggestion.toString();
			}

			//set the suggestion display
			this._completing = true;
			this.inputView
				.setValue(display)
				.focus()
				.select()
			;
			this._completing = false;

			//emit the event
			this.emit('select', suggestion);
		}

	}
};

module.exports = Presenter;
