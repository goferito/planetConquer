var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    browserify = require('gulp-browserify'),
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

gulp.task('assets', function () {
  return gulp.src('public/assets/**/*')
      .pipe(gulp.dest('build/assets'));
});

gulp.task('libs', function () {
  return gulp.src([
      'public/js/three/three.js',
      'public/js/three/OrbitControls.js',
      'public/js/three/shaders/CopyShader.js',
      'public/js/three/shaders/HorizontalBlurShader.js',
      'public/js/three/shaders/VerticalBlurShader.js',
      'public/js/three/shaders/GodrayShaders.js',
      'public/js/three/postprocessing/ShaderPass.js',
      'public/js/three/postprocessing/EffectComposer.js',
      'public/js/three/postprocessing/MaskPass.js',
      'public/js/three/postprocessing/RenderPass.js',
      'public/js/tween/tween.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('js', function () {
  return gulp.src('public/js/app.js')
    .pipe(jshint({
      indent: 2,
      newcap: true,
      noarg: true,
      noempty: true,
      quotmark: true,
      undef: true,
      unused: true,
      trailing: true,
      maxlen: 80,
      expr: true,
      loopfunc: true,
      strict: true,
      predef: ['window', 'document', 'require']
    }))
    .pipe(browserify({
      insertGlobals: true,
      extensions: ['.jsx'],
      debug: true
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
  gulp.watch('public/*.js', ['js']);
  gulp.watch('public/three/**/*', ['libs']);
  gulp.watch('public/tween/*.js', ['libs']);
  gulp.watch('public/assets/**/*', ['assets']);
  gulp.watch('public/css/*', ['css']);
});

gulp.task('default', ['watch', 'assets', 'libs', 'css', 'js']);

