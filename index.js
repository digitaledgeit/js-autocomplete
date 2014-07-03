var View = require('view');
//var TemplateView    = require('template-view');
var Presenter = require('./lib/Presenter');
var InputView = require('./lib/InputView');
var DropDownView = require('./lib/DropDownView');

/**
 * Create an suggest instance
 * @param   {Object}            options
 * @param   {HTMLElement}       options.el        The input element
 * @param   {array|function(string, function(*, array))}    options.source      A suggestion source
 * @param   {string|function(*)}                            [options.display]   A key or function used to convert the suggestion to a string
 * @returns {Presenter}
 */
module.exports = function (options) {

	var presenter = {

		hideDropDownIfEmpty: options.hideDropDownIfEmpty,

		source: options.source,

		display: options.display,

		minLength: options.minLength,

		inputView: new InputView({
			el: options.el.querySelector('.js-input')
		}),

		dropDownView: new DropDownView({
			el: options.el.querySelector('.js-dropdown')
		}),

		listItemViewFactory: function (query, suggestion) {
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
				el.className = 'autosuggest__suggestion';
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

module.exports.Presenter    = Presenter;
module.exports.InputView    = InputView;
module.exports.DropDownView = DropDownView;
