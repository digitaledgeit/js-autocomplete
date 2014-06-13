/**
 * Input view
 * @class
 */
var InputView = require('view').extend({

  events: {
    'blur': 'emit:blur',
    'focus': 'emit:focus',
    'keypress': 'onCharacter',
    'keyup': 'onKeyPress'
  },

  /**
   * Gets the query value
   * @returns   {String}
   */
  getQuery: function() {
    return this.el.value;
  },

  /**
   * Wait for the browser to add or remove the key and then trigger the change event
   * @param   {Event}   event
   */
  onCharacter: function(event) {
    var self = this;
    window.setTimeout(function() {
      self.emit('change');
    }, 1);
  },


  /**
   * Handles a key
   * @param   {Event}   event
   */
  onKeyPress: function(event) {
    var key;

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    switch (event.keyCode) {

      case  38:
        key = InputView.KEY_UP;
        break;

      case  40:
        key = InputView.KEY_DOWN;
        break;

    }

    if (key !== null) {
      event.preventDefault();
      this.emit('key', key);
    }

  }

});

InputView.KEY_UP = 'UP';
InputView.KEY_DOWN = 'DOWN';

module.exports = InputView;