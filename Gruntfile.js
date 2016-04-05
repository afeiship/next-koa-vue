module.exports = function (grunt) {
  'use strict';

  var redirect = '//static.consumer.zaijiadd.com';

  if (process.env.NODE_ENV == 'pre') {
    redirect = '//pre.static.consumer.zaijiadd.com';
  }

  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, {
    init: true,
    data: {
      pkg: grunt.file.readJSON('package.json'),
      src: 'src',
      temp: '.temp',
      dist: 'dist',
      dev: 'dev',
      redirect: redirect,
      ignoreSource: [
        'js/global.js',
        'js/app.js'
      ]
    }
  });
};
