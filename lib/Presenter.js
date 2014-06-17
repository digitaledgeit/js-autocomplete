var emitter     = require('emitter');
var InputView   = require('./InputView');

/**
 * Presenter
 * @param   {Object}          options
 * @param   {Function|Array}  options.source  The data source
 * @constructor
 */
function Presenter(options) {
	var self                    = this;
	this.source                 = options.source;
	this.inputView              = options.inputView;
	this.listView               = options.listView;
	this.listItemViewFactory    = options.listItemViewFactory;

	// === bind events ===

	this.inputView.on('change', this.suggest.bind(this));
	this.inputView.on('focus', this.suggest.bind(this));
	this.inputView.on('blur', function() {
		self.listView.setVisible(false);
	});

	this.inputView.on('key', function (key) {

		if (key === InputView.KEY_DELETE || key === InputView.KEY_BACKSPACE) {
			self.suggest();
		} else if (self.listView.isVisible()) {
			switch (key) {

				case InputView.KEY_UP:
					if (self.listView.getSelectedIndex() === null) {
						self.listView.complete(self.count() - 1);
					} else if (self.listView.hasPrevious()) {
						self.listView.selectPrevious()
					}
					break;

				case InputView.KEY_DOWN:
					if (self.listView.getSelectedIndex() === null) {
						self.listView.complete(0);
					} else if (self.listView.hasNext()) {
						self.listView.selectNext()
					}
					break;

				case InputView.KEY_ENTER:
					self.complete();
					break;

			}
		}
	});

	//insert the list after the input
	this.inputView.el.parentNode.insertBefore(this.listView.el, this.inputView.nextSibling);
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
 * Display a list of suggestions
 * @private
 * @param   {Array}   suggestions
 */
Presenter.prototype.display = function(suggestions) {
	this.suggestions = suggestions;

	this.listView.removeAll();

	for (var i = 0; i < suggestions.length; ++i) {
		var listItemView = this.listItemViewFactory('the-query', suggestions[i]);
		this.listView.append(listItemView);
	}

	if (suggestions.length > 0) { //TODO: use an option
		this.listView.setVisible(true);
	} else {
		this.listView.setVisible(false);
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

	//ensure the query is not empty
	if (query.length === 0) {
		self.listView.setVisible(false);
		return self;
	}

	//ensure the query is different to the previous
	if (query === this.query) {
		self.listView.setVisible(true);
		return self;
	}

	//fetch and display the suggestions
	self.fetch(query, function(suggestions) {
		self.emit('query', suggestions);
		self.display(suggestions);
		self.query = query;
	});

	return self;
};

/**
 * Complete the selected suggestion
 * @returns {exports}
 */
Presenter.prototype.complete = function() {
	if (this.listView.isVisible()) {

		this.listView.setVisible(false);

		if (this.listView.getSelectedIndex() !== null) {
			var suggestion = this.suggestions[this.listView.getSelectedIndex()];
			this.inputView.setValue(suggestion);
			this.emit('select', suggestion);
		}

	}
};

module.exports = Presenter;