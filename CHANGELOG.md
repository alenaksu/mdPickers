### 1.1.0

#### Bugfixes

* Fixed error when input are not in a form (cf2b00f)
* Fixed date object error (7417a93)

#### Features

* Added service to configure settings globally
* Added demo

### 1.0.1

* Published to NPM: https://www.npmjs.com/package/md-pickers

#### Bugfixes

* Cancelling a dialog does not leave an unhandled rejected promise flying around (thanks to [Marvin Huber](https://github.com/huberm416))

### 1.0.0

#### Breaking changes

* Default: 24 hours time format instead of am/pm. Use `mdp-ampm` to switch.
* `mdp-min-date` and `mdp-max-date` of `mdp-date-picker` now take either a `Date` object or a string formatted using `mdp-format` (they used to take only a string in `YYYY-MM-DD` format).

#### Features

* Support for angular 1.6 (thanks to [Andrea Vega](https://github.com/andrea-vega))
* Support for 24 hours format.
  This includes an attribute `mdp-ampm` to switch between 24/12 (disabled by default) (thanks to [Matteo Gaggiano](https://github.com/Marchrius))
* Option to set the parent element of the dialogs. This is needed for correct theme inheritance in `angular-material` pre 1.1.1 (see [angular-material issue #525](https://github.com/angular/material/issues/525#issuecomment-243751640)) (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Possibility to specify input name via `mdp-input-name` in order to allow for `ng-messages` (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* `mdp-min-date` and `mdp-max-date` also allow passing a `Date` object (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* `mdp-time-picker` now takes validation attributes `mdp-min-time` and `mdp-max-time` which are either `Date` objects or strings formatted using `mdp-format` (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))

#### Bugfixes

* Show validation errors when the form is submitted (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Higher `angular-material` versions are now possible (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Showing small `*` on the input placeholders if pickers are flagged as required (similar to standard `angular-material` inputs) (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Updating the `mdp-placeholder` dynamically is supported (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Changing the model changes is reflected in the views (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))
* Fixed support for validation via `ng-required` (thanks to [Marco Antônio Mafessolli](https://github.com/marcomafessolli))
* Changing the values of `mdp-min-date` and `mdp-max-date` triggers revalidation (thanks to [David Poetzsch-Heffter](https://github.com/dpoetzsch))

#### Housekeeping

* Converted all tabs to spaces (using 4 spaces everywhere now)
* Removed trailing whitespace

### 0.7.5

Minor bugfixes

### 0.7.4

Minor bugfixes

### 0.7.3

Several bugfixes

#### Features

* Added `mdp-disabled` 

#### Breaking changes

`min` and `max` attributes are refactored to `mdp-min-date` and `mdp-max-date` respectively and are setup as two-way binding

#### Features

* Floating labels and `mdp-no-float` attribute
* Directives are restricted to (A)ttribute and (E)lement
* `mdp-open-on-click` attribute for open date picker by clicking on the input

### 0.7.1

Bugfixes and improvements

### 0.7.0

Bugfixes and improvements (obviously.. :))

#### Breaking Changes

* `mdpTimePicker` and `mdpDatePicker` are now restricted to and Element (see demo for details)
* Pickers will not open clicking the input, but using the button

#### Features

* Button for open dialog
* Set first day of the week by changing Moment.js localeData
* Customize date format on date picker
* Dialog will not close others (needs angular material >= 1.1.0rc-1)

### 0.6.1

Minor bugfixes and improvements

### 0.6.0

#### Breaking Changes

* Removed Material Design Icons dependency
* `$mdpDatePicker` and `$mdpTimePicker` now accept the date/time and an object containing the options as arguments. _(see demo for more details)_
 
#### Features

* `mdpDatePicker` directive now accept min/max date and a filter function

```html
<input type="date" min="2000-01-01" max="2050-01-01" mdp-date-filter="myFilterFunction" />
```
```javascript
function myFilterFunction(date) {
    ...
}
```

* Output format in `mdpTimePicker` and `mdpDatePicker` directives thorugh `mdp-format` attribute _(see moment.js documentation for details)_
```html
<input type="text" min="2000-01-01" max="2050-01-01" mdp-format="DD/MM/YYYY" />
```
* Swipe capabilities on date picker
* Automatic switch between hours and minutes view in the time picker

### 0.5.2

#### Bugfixes

* Corrected packaje.json file

#### Features

* Added mdpTimePicker directive for input[type=time]

### 0.5.1

Minor bugfixes and improvements

### 0.5.0

#### Breaking Changes

* Service `$mdDatePicker` is changed to `$mdpDatePicker` 
* Directive `mdDatePicker` is changed to `mdpDatePicker` 

#### Features

* Time picker
* Dynamic year selector on date picker
* Animations
* Minor improvements 

### 0.3.2

#### Bugfixes

* Renamed classes names to avoid collisions with official date picker
* Changed angular repository in bower config

#### Features

* Added config provider for $mdDatePicker. Now is possible to set the labels of the dialog buttons with $mdDatePickerProvider.setOKButtonLabel(...) and $mdDatePickerProvider.setCancelButtonLabel(...)
* Minor improvements

### 0.3.0

#### Features

* Bower support

### 0.2.0

#### Breaking Changes

Repository name is changed to `mdPickers`. The goal is to have a both date and time pickers in the same module.

### 0.1.0

#### Features

* Date picker dialog
