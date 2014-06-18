var View = require('view');
var ListView = require('./ListView');

/**
 * Dropdown view
 * @class
 */
module.exports = View.extend({

	/**
	 * Initialise the view
	 * @param   {object}    [options]
	 * @param   {View}      [options.header]
	 * @param   {View}      [options.footer]
	 */
	init: function (options) {

		/**
		 * The header view
		 * @private
		 * @type {View}
		 */
		this.headerView;

		/**
		 * The footer view
		 * @private
		 * @type {View}
		 */
		this.footerView;

		/**
		 * The list view
		 * @private
		 * @type {View}
		 */
		this.listView = new ListView();

		this.el.appendChild(this.listView.el);

		this
			.setHeader(options ? options.header : undefined)
			.setFooter(options ? options.footer : undefined)
		;

	},

	// ===============================================================

	/**
	 * Get whether the view is hidden
	 * @returns   {boolean}
	 */
	isVisible: function () {
		return !this.el.classList.contains('is-hidden');
	},

	/**
	 * Set whether the view is hidden
	 * @param   {boolean}   visible
	 * @returns {exports}
	 */
	setVisible: function (visible) {
		if (visible) {
			this.el.classList.remove('is-hidden');
		} else {
			this.el.classList.add('is-hidden');
		}
		return this;
	},

	// ===============================================================

	/**
	 * Get the header view
	 * @return  {View}
	 */
	getHeader: function() {
		return this.headerView;
	},

	/**
	 * Set the header view
	 * @param   {View} view
	 * @returns {exports}
	 */
	setHeader: function(view) {

		if (!view instanceof View) {
			throw new Error('Parameter is not a view');
		}

		if (this.headerView) {
			this.el.removeChild(this.headerView.el);
		}

		this.headerView = view;

		if (this.headerView) {
			this.el.insertBefore(this.headerView.el, this.el.firstChild);
		}

		return this;
	},

	/**
	 * Get the list view
	 * @return  {View}
	 */
	getList: function() {
		return this.listView;
	},

	/**
	 * Get the footer view
	 * @return  {View}
	 */
	getFooter: function() {
		return this.footerView;
	},

	/**
	 * Set the footer view
	 * @param   {View} view
	 * @returns {exports}
	 */
	setFooter: function(view) {

		if (!view instanceof View) {
			throw new Error('Parameter is not a view');
		}

		if (this.footerView) {
			this.el.removeChild(this.footerView.el);
		}

		this.footerView = view;

		if (this.footerView) {
			this.el.appendChild(this.footerView.el);
		}

		return this;
	}

	// ===============================================================

});