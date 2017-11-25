# mdPickers
Material Design date/time pickers built with Angular Material and Moment.js

Note: This repository was forked from [alenaksu/mdPickers](https://github.com/alenaksu/mdPickers) because of [apparent inactivity](https://github.com/alenaksu/mdPickers/issues/192). With version 1.0.0 I merged some important pull requests and added a lot of minor features myself (see [changelog](https://github.com/dpoetzsch/md-pickers/blob/master/CHANGELOG.md) for details). In order to publish the update I renamed the package to `md-pickers` on bower. In the future will do my best to integrate further pull requests.

## Online demos

* [CodePen](https://codepen.io/dpoetzsch/full/NgJXjR/)

## Requirements

* [moment.js](http://momentjs.com/)
* [AngularJS](https://angularjs.org/)
* [Angular Material](https://material.angularjs.org/)

## Using mdPickers

Install via Bower:

```bash
bower install md-pickers
```

Alternatively, npm:

```bash
npm install md-pickers
```

Use in Angular:
```javascript
angular.module( 'YourApp', [ 'mdPickers' ] )
  .controller("YourController", YourController );
```

## Roadmap

- [x] Fixes for existing functionality
- [x] Integration of most important [pull requests of the original repository](https://github.com/alenaksu/mdPickers/pulls)
- [x] Update documentation and online demo
- [ ] Linting for code quality
- [ ] Unit tests
- [ ] Continuous Integration
- [ ] Typescript
- [ ] Add a picker for picking date & time as one
- [ ] [Unfork](https://stackoverflow.com/a/44140289/3594403) this repository if it matures (or merge it back into the original if it gets revived)

## Contributing

All contributions are welcome. In order to keep the code nice and clean please follow the [boy scout rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule).

Note on spaces vs. tabs: This project consistently uses 4 spaces for indentation.

### Building mdPickers

First install or update your local project's __npm__ and __bower__ tools:

```bash
# First install all the npm tools:
npm install
bower install

# or update
npm update
bower update
```

Then run the default gulp task:

```bash
# builds all files in the `dist` directory
gulp
# Additionally, you can build the demo
gulp demo
```

To run the demo:
```bash
# If you don't want/can't install http-server globally
./node_modules/http-server/bin/http-server

# Install http-server globally
npm install -g http-server
http-server
```

Then browse `/demo` (or `/demo-dist` if you built it) on the printed address.

### Release

- Check that changes work on demo
- Check that changes work on demo-dist
- Update version in `bower.json` and `packages.json`
- Add changes to `CHANGELOG.md`
- Build `dist` and `demo-dist` folders
- Create new tag for the version
- Submit to npm: `npm publish`

## License

Please see [LICENSE file](https://github.com/dpoetzsch/md-pickers/blob/master/LICENSE).
