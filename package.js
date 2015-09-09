// package metadata file for Meteor.js
var packageName = 'lbd41innovation:mdpickers';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '0.2.0';
var summary = 'Material Design date/time pickers for Angular Material';
var gitLink = 'https://github.com/alenaksu/mdPickers';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('angular:angular@1.4.1', where); // Dependencies
  api.use('angular:angular-material@0.10.1', where);
  api.use('momentjs:moment@2.10.6', where);

  api.addFiles('dist/mdPickers.min.js', where);
  api.addFiles('dist/mdPickers.min.css', where); // Files in use
});
