var View            = require('view');
//var TemplateView    = require('template-view');
var Presenter       = require('./lib/Presenter');
var InputView       = require('./lib/InputView');
var DropDownView    = require('./lib/DropDownView');

/**
 * Create an suggest instance
 * @param   {Object}            options
 * @param   {HTMLElement}       options.el        The input element
 * @param   {Function|Array}    options.source    The data source
 * @returns {Presenter}
 */
module.exports = function(options) {

  var presenter = {

    source: options.source,

    inputView: new InputView({
	    el: options.el.querySelector('.js-input')
    }),

    dropDownView: new DropDownView({
		el: options.el.querySelector('.js-dropdown')
    }),

    listItemViewFactory: function(query, suggestion) {
      var output, el;

      //convert the template to a string or HTML element
      if (typeof options.template === 'function') {
        output = options.template(query, suggestion);
      } else {
        output = options.template;
      }

      //convert the output to an element
      if (typeof output === 'string') {
        var el = document.createElement('div');
        el.className = 'autocomplete-list__item';
        el.innerHTML = output;
        output = el;
      }

      //create a view from the element
      var view = new View({
	      el: output,
	      events: {
		      'click': 'emit:select'
	      }
      });

	  return view;

//      return new TemplateView({
//        data:     suggestion,
//        template: options.template
//      });
    }

  };

  return new Presenter(presenter);
};

module.exports.Presenter  = Presenter;
module.exports.InputView  = InputView;
module.exports.ListView   = DropDownView;