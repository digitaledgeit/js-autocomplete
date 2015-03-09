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
	 * The display property or function to return the suggestion display value
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

	this.inputView                = options.inputView;
	this.dropDownView             = options.dropDownView;
	this.listView                 = this.dropDownView.getList();
	this.listItemViewFactory      = options.listItemViewFactory;
	this.selectItemWhenTabPressed = options.selectItemWhenTabPressed || true;

	/**
	 * The timeout
	 * @type    {integer}
	 * @private
	 */
	this.timeout;

	/**
	 * Whether the TAB key was pressed recently
	 * @type    {boolean}
	 * @private
	 */
	this.tabPressed = false;

	// === bind events ===

	this.inputView
		.on('click', function() {
			self.suggest();
		})
		.on('change', function() {
			self.suggest();
			self.emit('change');
		})
		.on('focus', function() {
			if (!self._completing) {
				self.suggest()
			}
		})
		.on('blur', function() {
			var wasOpen = self.isOpen();
			setTimeout(function() { //wait for the click event to fire before hiding the list

				if (!(wasOpen && !self.dropDownView.isVisible())) {
					//emit the blur event if no option was selected - if an option was selected the control should be focused again
					self.dropDownView.setVisible(false);
					self.emit('blur');
					return;
				}

			}, 200)
		})
		.on('key', function (key) {
			self.tabPressed = false;
			switch (key) {

				case InputView.KEY_ESC:
					self.close();
					break;

				case InputView.KEY_UP:
					if (self.isOpen()) {
						if (self.listView.count() > 0) {
							if (self.listView.getSelectedIndex() === null) {
								self.listView.selectIndex(self.listView.count() - 1);
							} else if (self.listView.hasPrevious()) {
								self.listView.selectPrevious()
							}
						}
					} else {
						self.suggest();
					}
					break;

				case InputView.KEY_DOWN:
					if (self.isOpen()) {
						if (self.listView.count() > 0) {
							if (self.listView.getSelectedIndex() === null) {
								self.listView.selectIndex(0);
							} else if (self.listView.hasNext()) {
								self.listView.selectNext()
							}
						}
					} else {
						self.suggest();
					}
					break;

				case InputView.KEY_ENTER:

					//if the user has indicated a selected suggestion and then pressed enter, then select it
					if (self.isOpen()) {
						self.complete();
					}
					break;

				case InputView.KEY_TAB:

					//if the user has indicated a selected suggestion and then pressed tab, then select it
					if (self.selectItemWhenTabPressed && self.isOpen()) {
						self.complete();
					}

					break;

			}
		})
	;

	this.listView.on('view:select', function(view) {
		self.listView.selectIndex(self.listView.indexOf(view));
		self.complete();
		self.focus();
	});

	//insert the list after the input
	this.inputView.el.parentNode.insertBefore(this.dropDownView.el, this.dropDownView.el.nextSibling);
}
emitter(Presenter.prototype);

/**
 * Focus the control
 * @returns {Presenter}
 */
Presenter.prototype.focus = function() {
	return this.inputView.focus();
};

/**
 * Get the value
 * @returns {String}
 */
Presenter.prototype.getValue = function() {
	return this.inputView.getValue();
};

/**
 * Set the value
 * @param   {String} value
 * @returns {Presenter}
 */
Presenter.prototype.setValue = function(value) {
	this.inputView.setValue(value);
	return this;
};

/**
 * Gets whether the drop-down-menu is open
 * @returns {boolean}
 */
Presenter.prototype.isOpen = function() {
	return this.dropDownView.isVisible();
};

/**
 * Opens the drop-down-menu
 * @returns {Presenter}
 */
Presenter.prototype.open = function() {
	this.dropDownView.setVisible(true);
	return this;
};

/**
 * Closes the drop-down-menu
 * @returns {Presenter}
 */
Presenter.prototype.close = function() {
	this.dropDownView.setVisible(false);
	return this;
};

/**
 * Suggest items based on the query string
 * @returns {Presenter}
 */
Presenter.prototype.suggest = function() {
	var self    = this;
	var query   = self.inputView.getValue();

	//ensure the query is longer than the minimum length
	if (query.length < this.minLength) {
		self.close();
		return self;
	}

	//ensure the query is different to the previous
	if (query === this.query) {
		self.openIfPreferred();
		return self;
	}

	//wait till the user stops typing
	window.clearTimeout(this.timeout);
	this.timeout = window.setTimeout(function() {

		//fetch the suggestions
		self.fetch(query, function(suggestions) {

			//record the suggestions
			self.query          = query;
			this.suggestions    = suggestions;

			//display the suggestions
			self.populate(suggestions);

			//emit the suggestions
			self.emit('suggest', suggestions);

		});

	}, 250);

	return self;
};

/**
 * Complete the selected suggestion
 * @returns {Presenter}
 */
Presenter.prototype.complete = function() {
  var self = this;
	if (this.dropDownView.isVisible()) {

		this.close();

		if (this.listView.getSelectedIndex() !== null) {

			//get the suggestion object
			var suggestion = this.suggestions[this.listView.getSelectedIndex()];

			//get the suggestion display
			var display;
			if (typeof this.display === 'function') {
				display = this.display(suggestion);
			} else if (typeof this.display === 'string') {
				if (typeof suggestion[this.display] === 'function') {
					display = suggestion[this.display]();
				} else {
					display = suggestion[this.display];
				}
			} else {
				display = suggestion.toString();
			}

			//set the suggestion display
			this._completing = true;
			this.inputView
				.setValue(display)
				.select()
			;

      //hack for IE - IE seems to delay the focus event which results in the dropdown list being opened right after it has been closed
      setTimeout(function() {
        self._completing = false;
      }, 0);

			//emit the event
			this.emit('select', suggestion);
		}

	}
};

/**
 * Opens the drop-down-menu if the options permit it
 */
Presenter.prototype.openIfPreferred = function() {
	if (this.hideDropDownIfEmpty && this.suggestions.length == 0) {
		this.close();
	} else {
		this.open();
	}
}

/**
 * Fetch suggestions for the query
 * @private
 * @param   {String}    query
 * @param   {Function}  callback
 */
Presenter.prototype.fetch = function(query, callback) {
	this.query = query;
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
		var listItemView = this.listItemViewFactory(this.query, suggestions[i]);
		this.listView.append(listItemView);
	}

	this.openIfPreferred();
	return this;
};

module.exports = Presenter;
