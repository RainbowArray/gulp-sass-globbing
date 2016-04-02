/**
 * gulp-sass-globbing
 * https://github.com/mdrummond/gulp-sass-globbing
 *
 * Modeled after grunt-sass-globbing: takes in actual files and outputs a new
 * file containing a list of @import rules in sass. Does not use regex to parse
 * an @import statement within the incoming file stream.
 *
 * Copyright (c) 2016 Marc Drummond
 * Licensed under the MIT license.
 */

var slash = require('slash'),
   path = require('path');
   fs = require('fs');
   through = require('through2');
   glob = require('glob');

module.exports = function(file, options) {
  if (!file) {
    throw new PluginError(PLUGIN_NAME, 'Missing file option.');
  }

  // Merge options with these defaults.
  options = {
    useSingleQuotes: false,
    signature: '/* generated with grunt-sass-globbing */'
  }

  // Add line returns to valid signatures.
  if (typeof options.signature === 'string' && options.signature !== ''){
    options.signature = options.signature + '\n\n';
  }
  // Remove signature line when requested.
  else if (options.signature === false) {
    options.signature = '';
  }

  // Default to double quotes.
  var quoteSymbol = '"';
  // Use single quote if requested.
  if (typeof options.useSingleQuotes !== 'undefined' && options.useSingleQuotes === true) {
    quoteSymbol = '\'';
  }

  var transform = function(file, encoding, callback) {
    // File source required.
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    // Complete files required, so streams are not supported.
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported.'));
    }
    else if (file.isBuffer()) {

      return callback(null, file);
    }
  };

  return through.obj(transform);
};
