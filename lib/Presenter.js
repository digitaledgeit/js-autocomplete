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

	this.inputView.on('change', function () {
		self.autocomplete();
	});

	this.inputView.on('key', function (key) {

		if (key === InputView.KEY_DELETE || key === InputView.KEY_BACKSPACE) {
			self.autocomplete();
		} else if (self.listView.isVisible()) {
			switch (key) {

				case InputView.KEY_UP:
					if (self.listView.getSelectedIndex() === null) {
						self.listView.select(self.count() - 1);
					} else if (self.listView.hasPrevious()) {
						self.listView.selectPrevious()
					}
					break;

				case InputView.KEY_DOWN:
					if (self.listView.getSelectedIndex() === null) {
						self.listView.select(0);
					} else if (self.listView.hasNext()) {
						self.listView.selectNext()
					}
					break;

				case InputView.KEY_ENTER:
					self.select();
					break;

			}
		}
	});

	//insert the list after the input
	this.inputView.el.parentNode.insertBefore(this.listView.el, this.inputView.nextSibling);
}
emitter(Presenter.prototype);


/**
 * Query the source for list of suggestions
 * @param   {String}    query
 * @param   {Function}  callback
 */
Presenter.prototype.query = function(query, callback) {
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
 * Populate the list with the suggestions
 * @param   {Array}   suggestions
 */
Presenter.prototype.populate = function(suggestions) {

	this.suggestions = suggestions;

	this.listView.removeAll();

	for (var i = 0; i < suggestions.length; ++i) {
		var listItemView = this.listItemViewFactory('the-query', suggestions[i]);
		this.listView.append(listItemView);
	}

	return this;
};

/**
 * Suggest words based on the entered query
 * @returns {exports}
 */
Presenter.prototype.autocomplete = function() {
	var self    = this;
	var query   = self.inputView.getValue();

	//check a query has been entered
	if (query) {
		self.query(query, function(suggestions) {

			self.populate(suggestions);

			if (suggestions.length > 0) { //TODO: use an option
				self.listView.setVisible(true);
			} else {
				self.listView.setVisible(false);
			}

		});
	} else {

		self.listView.setVisible(false);

	}

	return this;
};

/**
 * Select the suggestion
 * @returns {exports}
 */
Presenter.prototype.select = function() {
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