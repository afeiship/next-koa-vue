(function () {


  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var conf = require('./conf');
  var iconfont = require('gulp-iconfont');
  var iconfontCss = require('gulp-iconfont-css');
  var FONT_FAMILY = 'FeiMobileFont';

  gulp.task('fonts-icon', function () {
    return gulp.src(path.join(conf.paths.src, '/fonts-svg-icons/*.svg'))
      .pipe(iconfontCss({
        fontName: FONT_FAMILY,
        path: path.join(conf.paths.src, '/fonts-svg-icons/templates/_icons.scss'),
        targetPath: '../styles/_icons.scss',
        fontPath: '../fonts/'
      }))
      .pipe(iconfont({
        fontName: FONT_FAMILY, // required
        prependUnicode: true, // recommended option
        formats: ['ttf', 'eot', 'woff','woff2','svg'] // default, 'woff2' and 'svg' are available
      }))
      .pipe(gulp.dest(path.join(conf.paths.src, '/fonts')));
  });


  gulp.task('fonts-dev', function () {
    return gulp.src([
        path.join(conf.paths.src, '/fonts/*.*')
      ])
      .pipe(gulp.dest(
        path.join(conf.paths.dev, '/fonts')
      ));
  });


  gulp.task('fonts-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/fonts/*.*')
    ], ['fonts-dev'])
  });

}());
