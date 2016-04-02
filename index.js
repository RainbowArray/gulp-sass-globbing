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

var slash       = require('slash'),
    path        = require('path');
    through     = require('through2');
    gutil       = require('gulp-util'),
    PluginError = gutil.PluginError,
    File        = gutil.File;

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

  // Begin with signature line, import statements will follow.
  var imports = options.signature;

  var bufferContents = function(file, encoding, callback) {
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
      // Check if this is a Sass file.
      if (file.extname.toLowerCase() == '.scss' || file.extname.toLowerCase() == '.sass') {
        // Remove the parent file base path from the path we will output.
        var filename = path.normalize(file.path);
        var base = path.join(path.normalize(file.base), '/');
        filename = filename.replace(base, '');

        // Add import statement.
        imports = imports + '@import ' + quoteSymbol + slash(filename) + quoteSymbol;
      }

      return callback(null, file);
    }
  };

  var endStream(callback) {
    // No files passed in, no file goes out.
    if (!imports) {
      callback();
      return;
    }

    // Create globbed file with import statements.
    var globFile = new File(file);
    globFile.contents = imports;

    this.push(globFile);
    callback();
  }

  return through.obj(bufferContents, endStream);
};
