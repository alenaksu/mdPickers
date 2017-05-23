# mdPickers
Material Design date/time pickers built with Angular Material and Moment.js

Note: This repository was forked from [alenaksu/mdPickers](https://github.com/alenaksu/mdPickers) because of [apparent inactivity](https://github.com/alenaksu/mdPickers/issues/192). With version 1.0.0 I merged some important pull requests and added a lot of minor features myself (see [changelog](https://github.com/dpoetzsch/md-pickers/blob/master/CHANGELOG.md) for details). In order to publish the update I renamed the package to `md-pickers` on bower. In the future will do my best to integrate further pull requests.

## Online demos

* [CodePen](http://codepen.io/alenaksu/full/eNzbrZ)

## Requirements

* [moment.js](http://momentjs.com/)
* [AngularJS](https://angularjs.org/)
* [Angular Material](https://material.angularjs.org/)

## Using mdPickers

Install via Bower:

```bash
bower install md-pickers
```

Use in Angular:
```javascript
angular.module( 'YourApp', [ 'mdPickers' ] )
  .controller("YourController", YourController );
```

## Building mdPickers

First install or update your local project's __npm__ tools:

```bash
# First install all the npm tools:
npm install

# or update
npm update
```

Then run the default gulp task:

```bash
# builds all files in the `dist` directory
gulp
```
