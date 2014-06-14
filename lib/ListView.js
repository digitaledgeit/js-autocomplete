var ViewCollection = require('view-collection');

module.exports = ViewCollection.extend({

	/**
	 * Initialise the view
	 */
	init: function () {
		ViewCollection.prototype.init.call(this);
		this._selectedIndex = null;
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
	 * Get the selected index
	 * @returns {int|null}
	 */
	getSelectedIndex: function () {
		return this._selectedIndex;
	},

	/**
	 * Selects the view at the specified index
	 * @param   {int} index
	 * @returns {exports}
	 */
	select: function (index) {

		//check index
		if (index !== null && (index < 0 || index >= this.count())) {
			throw new Error('Index out of bounds');
		}

		//unset the old selected view
		if (this._selectedIndex !== null) {
			this.at(this._selectedIndex).el.classList.remove('is-selected');
		}

		//remember the index
		this._selectedIndex = index;

		//set the new selected view
		if (this._selectedIndex !== null) {
			this.at(this._selectedIndex).el.classList.add('is-selected');
		}

		return this;
	},

	/**
	 * Get whether the list has a "previous" item
	 * @returns {boolean}
	 */
	hasPrevious: function () {
		return this.getSelectedIndex() !== null && this.count() > 0 && this.getSelectedIndex() !== 0;
	},

	/**
	 * Select the "previous" item
	 * @returns {exports}
	 */
	selectPrevious: function () {
		this.select(this.getSelectedIndex() - 1);
	},

	/**
	 * Get whether the list has a "next" item
	 * @returns {boolean}
	 */
	hasNext: function () {
		return this.getSelectedIndex() !== null && this.count() > 0 && this.getSelectedIndex() !== this.count() - 1;
	},

	/**
	 * Select the "next" item
	 * @returns {exports}
	 */
	selectNext: function () {
		this.select(this.getSelectedIndex() + 1);
	},

	/**
	 * @inheritDoc
	 */
	prepend: function(view) {

		//increase the selected index
		if (this._selectedIndex !== null) {
			++this._selectedIndex;
		}

		return ViewCollection.prototype.prepend.apply(this, arguments);
	},

	/**
	 * @inheritDoc
	 */
	remove: function(view) {

		//deselect the view if it is selected
		if (this.at(this.getSelectedIndex()) === view) {
			this.select(null);
		}

		return ViewCollection.prototype.remove.apply(this, arguments);
	},

	/**
	 * @inheritDoc
	 */
	removeAll: function() {

		//deselect the view
		this.select(null);

		return ViewCollection.prototype.removeAll.call(this);
	}

	// ===============================================================

	//TODO: handle removal of the selected index

});