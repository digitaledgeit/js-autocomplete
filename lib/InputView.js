var events = require('input-event');

/**
 * Input view
 * @class
 */
var InputView = require('view').extend({

	events: {
		'blur':         'emit:blur',
		'focus':        'emit:focus',
		'keydown':      'onKeyDown',
		'keyup':        'onKeyUp',
		'click':        'emit:click'
	},

	/**
	 * Initialise the view
	 */
	init: function() {
		events.bind(this.el, this.onCharPress.bind(this));
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
	 * Focus the input text
	 * @returns     {InputView}
	 */
	focus: function() {
		this.el.focus();
		return this;
	},

	/**
	 * Select the input text
	 * @returns     {InputView}
	 */
	select: function() {
		this.el.select(); //Chrome and IE focus the input when it is selected which is not desired, but FF works
		return this;
	},

	/**
	 * Wait for the browser to add or remove the key and then trigger the change event
	 * @param   {Event}   event
	 */
	onCharPress: function () {
		this.emit('change');
	},

	/**
	 * Handles a key
	 * @param   {Event}   event
	 */
	onKeyDown: function (event) {
		var key;

		if (event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		switch (event.keyCode) {

			case 27:
				key = InputView.KEY_ESC;
				break;

			case 38:
				key = InputView.KEY_UP;
				break;

			case 40:
				key = InputView.KEY_DOWN;
				break;

			case 13:
				key = InputView.KEY_ENTER;
				break;

			case 9:
				key = InputView.KEY_TAB;
				this.emit('key', key);
				return;
				break;

		}

		if (key) {
			event.preventDefault();
		}
	},

	/**
	 * Handles a key
	 * @param   {Event}   event
	 */
	onKeyUp: function (event) {
		var key;

		if (event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		switch (event.keyCode) {

			case 27:
				key = InputView.KEY_ESC;
				break;

			case 38:
				key = InputView.KEY_UP;
				break;

			case 40:
				key = InputView.KEY_DOWN;
				break;

			case 13:
				key = InputView.KEY_ENTER;
				break;

			case 9:
				key = InputView.KEY_TAB;
				this.emit('key', key);
				return;
				break;

		}

		if (key) {
			event.preventDefault();
			this.emit('key', key);
		}

	}

});

InputView.KEY_ESC       = 'ESC';
InputView.KEY_UP        = 'UP';
InputView.KEY_DOWN      = 'DOWN';
InputView.KEY_ENTER     = 'ENTER';
InputView.KEY_TAB       = 'TAB';

module.exports = InputView;
