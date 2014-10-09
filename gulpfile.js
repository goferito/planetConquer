var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    stylus = require('gulp-stylus');

gulp.task('clean', function () {
  return gulp.src(
    [
      'build/*.html',
      'build/css',
      'build/js',
      'build/assets'],
    {read: false})
    .pipe(clean());
});

gulp.task('css', function () {
  return gulp.src('public/css/*.styl')
      .pipe(stylus())
      .pipe(gulp.dest('build/css'));
});
