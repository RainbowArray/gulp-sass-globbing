# gulp-sass-globbing

> Create an import map file with @import from a configured path

> This plugin can be used with libsass.

> The initial intent is to offer an alternative to grunt-sass-globbing.

## Supported CSS preprocessors

### libsass

libsass (and Ruby Sass) do not support globbing out-of-the-box. This plugin helps you migrating existing projects from Ruby Sass to libsass.

## Getting Started

This plugin requires Gulp

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it shares recipes for [gulpfiles](https://github.com/gulpjs/gulp/tree/master/docs/recipes) as well as how to install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gulp-sass-globbing --save-dev
```

Once the plugin has been installed, it may be enabled inside your gulpfile with this line of JavaScript:

```js
gulp.require('gulp-sass-globbing');
```

## The "glob:sass" task

### Overview

In your project's gulpfile, add a task named `glob:sass`.

### Usage Example

In this example, an import map from a defined path will be created.
You might want to add an empty destination file to your version control: `gulp-sass-globbing` will overwrite it with the generated import statements.

#### Usage with all options

```js
gulp.task('glob:sass', function() {
  var globSass = require('gulp-sass-globbing');

  gulp.src('components/**/*.scss', {cwd: 'sass/partials/global-styles'})
    .pipe(globSass(
      {
        path: '_components.scss'
      },
      {
        useSingleQuotes: true
        signature: '// Hello, World!'
      }
    ))
    .pipe(gulp.dest('sass/partials/global-styles'));
};
```

In the gulp.src command, define the path where the files should be globbed from,
based on the directory where the file with the globbed import statements will be
located: this should be defined with the cwd key in the options for gulp.src, as
well as in gulp.dest at the end of the task.

The globSass function takes two arguments:
  - A Vinyl file object with the name of the file that should be created.
  - An options object.

### Options

#### useSingleQuotes
Type: `Boolean`
Default: `false`

Determines whether single or double quotes are used around import statements.

* `false` - Double quotes are used.
* `true` - Single quotes are used.

#### signature
Type: `string`
Default: `/* generated with grunt-sass-globbing */\n\n`

Sets the signature for the map files.

* `false` - Disables adding of signature.

### Usage in SCSS file

In this example, your file is located in sass/global-styles.scss. This file imports the generated map files
described in the example gulpfile above.

```scss
@import "partials/global-styles/components";
@import "partials/core";

// more imports or rules
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Gulp](http://gulpjs.com/).

## Acknowledgements

The initial goal of this project is to provide the same features as [grunt-sass-globbing](https://github.com/DennisBecker/grunt-sass-globbing/blob/master/README.md), from which this draws heavily. That project has a nice model of taking an import directory as its source and then creating a file that holds import statements.

A few sass globbing projects existed for Gulp, but with a different approach that required a file to define the location of the files that should be globbed:
- [gulp-sass-glob-import](https://github.com/bleuarg/gulp-sass-glob-import/blob/master/README.md)
- [gulp-sass-bulk-import](https://github.com/mathisonian/gulp-sass-bulk-import)
- [gulp-sass-glob](https://github.com/tomgrooffer/gulp-sass-glob)

I also reviewed the code for [gulp-concat](https://github.com/contra/gulp-concat/blob/master/index.js), which offered some helpful model code.

Thank you to the creators of all of these projects, and to all who contribute to these and other related projects.
