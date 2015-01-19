var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var stylus = require('gulp-stylus');
var stylish = require('jshint-stylish');
var merge = require('merge');
var gutil = require('gulp-util');

var jshintConfig = {
  maxerr: 8,
  devel: true,
  indent: 2,
  newcap: true,
  noarg: true,
  noempty: true,
  quotmark: true,
  undef: true,
  unused: true,
  trailing: true,
  maxlen: 120,
  expr: true,
  loopfunc: true,
};

var onError = function (err) {
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
};

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
  return gulp.src('src/public/css/*.styl')
      .pipe(stylus())
      .pipe(gulp.dest('build/css'));
});

gulp.task('assets', function () {
  return gulp.src('src/public/assets/**/*')
      .pipe(gulp.dest('build/assets'));
});

gulp.task('libs', function () {
  return gulp.src([
      'src/public/libs/three/three.js',
      'src/public/libs/three/OrbitControls.js',
      'src/public/libs/three/shaders/CopyShader.js',
      'src/public/libs/three/shaders/HorizontalBlurShader.js',
      'src/public/libs/three/shaders/VerticalBlurShader.js',
      'src/public/libs/three/shaders/GodrayShaders.js',
      'src/public/libs/three/postprocessing/ShaderPass.js',
      'src/public/libs/three/postprocessing/EffectComposer.js',
      'src/public/libs/three/postprocessing/MaskPass.js',
      'src/public/libs/three/postprocessing/RenderPass.js',
      'src/public/libs/tween/tween.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint-server', function () {
  return gulp.src([
      'src/server/**/*.js',
      'app.js',
      'gulpfile.js',
    ])
    .pipe(jshint(merge(jshintConfig, {
      node: true,
    })))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .on('error', onError);
});

gulp.task('jshint-public', function () {
  return gulp.src([
      'src/public/*.js',
      'src/public/game/*.js',
      'src/shared/**/*.js'
    ])
    .pipe(jshint(merge(true, jshintConfig, {
      globals: {
        module: true,
        THREE: true,
        TWEEN: true,
      },
      browser: true,
      predef: ['window', 'document', 'require']
    })))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .on('error', onError);
});

gulp.task('js', ['jshint-public'], function () {
  return gulp.src('src/public/app.js')
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('compress', function () {
  return gulp.src('build/js/*.js')
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
  gulp.watch('src/public/*.js', ['js']);
  gulp.watch('src/public/game/*.js', ['js']);
  gulp.watch('src/public/libs/three/**/*', ['libs']);
  gulp.watch('src/public/libs/tween/*.js', ['libs']);
  gulp.watch('src/public/assets/**/*', ['assets']);
  gulp.watch('src/public/css/*', ['css']);
  gulp.watch('src/server/**/*.js', ['jshint-server']);
});

gulp.task('default', ['watch', 'assets', 'libs', 'css', 'js', 'jshint-server']);

