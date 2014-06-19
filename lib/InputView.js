/**
 * Input view
 * @class
 */
var InputView = require('view').extend({

	events: {
		'blur':         'emit:blur',
		'focus':        'emit:focus',
		'input':        'onCharPress',
		'keyup':        'onKeyPress'
	},

	/**
	 * Get the query value
	 * @returns {String}
	 */
	getValue: function() {
		return this.el.value;
	},

	/**
	 * Set the query value
	 * @param   {String} value
	 * @returns {InputView}
	 */
	setValue: function(value) {
		this.el.value = value;
		return this;
	},

	/**
	 * Wait for the browser to add or remove the key and then trigger the change event
	 * @param   {Event}   event
	 */
	onCharPress: function (event) {
		var self = this;
		self.emit('change');
	},

	/**
	 * Handles a key
	 * @param   {Event}   event
	 */
	onKeyPress: function (event) {
		var key;

		if (event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		switch (event.keyCode) {

			case 38:
				key = InputView.KEY_UP;
				break;

			case 40:
				key = InputView.KEY_DOWN;
				break;

			case 13:
				key = InputView.KEY_ENTER;
				break;

		}

		if (key) {
			event.preventDefault();
			this.emit('key', key);
		}

	}

});

InputView.KEY_UP        = 'UP';
InputView.KEY_DOWN      = 'DOWN';
InputView.KEY_ENTER     = 'ENTER';

module.exports = InputView;
