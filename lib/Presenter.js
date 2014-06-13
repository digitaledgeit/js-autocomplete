var InputView = require('./InputView');

/**
 * Presenter
 * @param   {Object}          options
 * @param   {Function|Array}  options.source  The data source
 * @constructor
 */
function Presenter(options) {
  var self                  = this;
  this.source               = options.source;
  this.inputView            = options.inputView;
  this.listView             = options.listView;
  this.listItemViewFactory  = options.listItemViewFactory;

  // === bind events ===

  this.inputView.on('change', function() {
    var query = this.getQuery();

    //check a query has been entered
    if (query) {
      self.query(this.getQuery(), function(suggestions) {
        self.populate(suggestions);
        self.listView.show();
      });
    } else {
	    self.listView.hide();
    }

  });

  this.inputView.on('key', function(key) {
    if (!self.listView.isHidden()) {
      console.log(key, InputView.KEY_UP);
      switch (key) {

        case InputView.KEY_UP:
          if (self.listView.getSelectedIndex() === null) {
            self.listView.select(self.count()-1);
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

     }
    }
  });

  //insert the list after the input
  this.inputView.el.parentNode.insertBefore(this.listView.el, this.inputView.nextSibling);
}

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
  console.log(suggestions);
  this.listView.removeAll();
  for (var i=0; i<suggestions.length; ++i) {
    var listItemView = this.listItemViewFactory('the-query', suggestions[i]);
    this.listView.append(listItemView);
  }
};

module.exports = Presenter;