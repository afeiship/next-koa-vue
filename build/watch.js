(function () {

  'use strict';
  var gulp = require('gulp');

  gulp.task('watch', [
    'styles-watch-dev',
    'scripts-watch-dev',
    'fonts-watch-dev',
    'images-watch-dev',
    'jade-watch-dev'
  ]);


}());
