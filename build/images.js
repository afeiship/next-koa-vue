(function () {

  var path = require('path');
  var gulp = require('gulp');
  var imagemin = require('gulp-imagemin');
  var pngquant = require('imagemin-pngquant');
  var conf = require('./conf');


  gulp.task('images-dev', function () {
    return gulp.src([path.join(conf.paths.src, '/images/**/*')])
      // .pipe(imagemin({
      //   progressive: true,
      //   svgoPlugins: [{removeViewBox: false}],
      //   use: [pngquant()]
      // }))
      .pipe(gulp.dest(path.join(conf.paths.dev, '/images')));
  });

  gulp.task('images-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/images/**/*')
    ], ['images-dev'])
  });


}());
