var ViewCollection = require('view-collection');

/**
 * View collection
 * @class
 */
module.exports = ViewCollection.extend({

	/**
	 * Initialise the view
	 */
	init: function () {

		/**
		 * The selected index
		 * @private
		 * @type {int}
		 */
		this.selectedIndex = null;

		ViewCollection.prototype.init.apply(this, arguments);
	},

	// ===============================================================
	
	/**
	 * Get the selected index
	 * @returns {int|null}
	 */
	getSelectedIndex: function () {
		return this.selectedIndex;
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
		if (this.selectedIndex !== null) {
			this.at(this.selectedIndex).el.classList.remove('is-selected');
		}

		//remember the index
		this.selectedIndex = index;

		//set the new selected view
		if (this.selectedIndex !== null) {
			this.at(this.selectedIndex).el.classList.add('is-selected');
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
		if (this.selectedIndex !== null) {
			++this.selectedIndex;
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