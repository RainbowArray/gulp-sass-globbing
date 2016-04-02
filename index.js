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
    throw new PluginError('gulp-sass-globbing', 'Missing file option.');
  }

  options = options || {};

  // Merge options with these defaults.
  defaults = {
    useSingleQuotes: false,
    signature: '/* generated with gulp-sass-globbing */'
  }
  if (!("useSingleQuotes" in options)) {
    options.useSingleQuotes = defaults.useSingleQuotes;
  }
  if (!("signature" in options)) {
    options.signature = defaults.signature;
  }

  // Remove signature line when requested.
  if (options.signature === false) {
    options.signature = '';
  }

  // Default to double quotes.
  var quoteSymbol = '"';
  // Use single quote if requested.
  if (typeof options.useSingleQuotes !== 'undefined' && options.useSingleQuotes === true) {
    quoteSymbol = '\'';
  }

  // Store import statements;
  var imports = '';

  var bufferContents = function(file, encoding, callback) {
    // File source required.
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    // Complete files required, so streams are not supported.
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-sass-globbing', 'Streams not supported.'));
    }
    else if (file.isBuffer()) {
      // Check if this is a Sass file.
      var ext = path.extname(file.path);
      if (ext.toLowerCase() == '.scss' || ext.toLowerCase() == '.sass') {
        // Remove the parent file base path from the path we will output.
        var filename = path.normalize(file.path);
        var cwd = path.normalize(file.cwd);
        var cwdfile = (filename.substr(filename.search(cwd))).replace(cwd, '');
        var importname = (cwdfile.replace(/\.(scss|sass)$/, '')).replace('/_', '/');
        if (importname.charAt(0) === '/') {
          importname = importname.substr(1);
        }

        // Add import statement.
        imports = imports + '@import ' + quoteSymbol + slash(importname) + quoteSymbol + ';\n';
      }

      callback();
    }
  };

  var endStream = function(callback) {
    // globFile will contain import statements.
    var globFile = new File(file);

    // Begin with signature line, import statements will follow.
    var filecontents = options.signature;
    // Check if valid signature exists.
    if (typeof options.signature === 'string' && options.signature !== ''){
      // Provide single line break after signature if there are no imports.
      if (imports === '') {
        filecontents = filecontents + '\n';
      }
      // Provide dpuble line break after signature if there are imports.
      else {
        filecontents = filecontents + '\n\n' + imports;
      }
    }

    // Ensure filecontents at least have a single line break.
    if (filecontents === '') {
      filecontents = '\n';
    }

    // Add import statements to glob file, ensure file ends with newline.
    globFile.contents = new Buffer(filecontents);

    this.push(globFile);
    callback();
  }

  return through.obj(bufferContents, endStream);
};
