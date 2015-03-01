# autosuggest

An auto suggest input.

## Installation

	component install digitaledgeit/js-autosuggest

## Setup

		var presenter = require('autosuggest')({
            el:             document.querySelector('.js-autosuggest'),
            source:         matcher(countries, {properties: ['name'], limit: 6, ignore_case: true}),
	        display:        'name',
            template:       function(query, country) {
                return '<div class="country__code">'+country.code+'</div><div class="country__name">'+country.name+'</div>';
            },
	        minLength: 1,
	        hideDropDownIfEmpty: true,
            listItemClasses: 'country'
        });

## API

### new Autosuggest(options : object)

#### Options

- `hint` 		-
- `highlight` 	-
- `minlength` 	- The minimum number of characters the user must enter before any suggestions are fetched.

- `source` 		- A suggestion source - an array of suggestions, a `function(query : string)` that returns an array of suggestions or a `function(query : string, done : function(suggestions : array))` that calls the `done` method.
- `display`		-
- `template`	-


### .open()

Open the dropdown menu.

### .close()

Close the dropdown menu.

### .getValue()

Get the current input value.

### .setValue(value)

Set the current input value.

### .focus()

Focus the input element.

## Events

- `opened` 		- Triggered when the dropdown menu is opened.
- `closed` 		- Triggered when the dropdown menu is closed.
- `suggested` 	- Triggered when a suggestion is displayed in a dropdown. Passed the suggestion objects.
- `selected` 	- Triggered when a suggestion is selected from the dropdown. Passed the suggestion object.

- `blur` 		- Triggered
- `change` 		-

## Matcher


## Example

1. Run `component build --dev`
2. Open `test\example\countries.html`

## Test

1. Run `component build --dev`
2. Run `component test phantom`

## Troubleshooting

*Note*: Requires the following shims for IE8:

- bind
- classList
- indexOf
- event.preventDefault
