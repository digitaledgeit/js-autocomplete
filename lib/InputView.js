/**
 * Input view
 * @class
 */
var InputView = require('view').extend({

	events: {
		'blur':     'emit:blur',
		'focus':    'emit:focus',
		'keypress': 'onCharPress',
		'keyup':    'onKeyPress'
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

		if (event.charCode < 32) {
			
			//prevent the form submitting on enter				
			if (event.charCode == 13) {
				event.preventDefault();
			}
			
			return;
		}

		window.setTimeout(function () {
			self.emit('change');
		}, 1);
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

			case 8:
				key = InputView.KEY_BACKSPACE;
				break;

			case 13:
				key = InputView.KEY_ENTER;
				break;

			case 38:
				key = InputView.KEY_UP;
				break;

			case 40:
				key = InputView.KEY_DOWN;
				break;

			case 46:
				key = InputView.KEY_DELETE;
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
InputView.KEY_DELETE    = 'DELETE';
InputView.KEY_BACKSPACE = 'BACKSPACE';
InputView.KEY_ENTER     = 'ENTER';

module.exports = InputView;
