(function () {

  /**
   *  Welcome to your gulpfile!
   *  The gulp tasks are splitted in several files in the gulp directory
   *  because putting all here was really too long
   */

  'use strict';

  var gulp = require('gulp');
  var fs = require('fs');

  /**
   *  This will load all js or coffee files in the gulp directory
   *  in order to load all gulp tasks
   */

  fs.readdirSync('./build').map(function(file) {
    require('./build/' + file);
  });

  gulp.task('default', [
    'clean',
    'watch'
  ], function () {
    gulp.start([
      'images-dev',
      'fonts-dev',
      'styles-dev',
      'scripts-dev',
      'jade-dev',
    ]);
  });

}());
