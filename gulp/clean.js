(function () {

  var gulp = require('gulp');
  var del = require('del');
  var conf = require('./conf');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
  });


  gulp.task('clean-dev', function () {
    return del('dev');
  });

  gulp.task('clean-dist', function () {
    return del('dist');
  });

  gulp.task('clean-temp', function () {
    return del('temp');
  });

}());
