var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var stylus = require('gulp-stylus');

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
      'src/public/js/three/three.js',
      'src/public/js/three/OrbitControls.js',
      'src/public/js/three/shaders/CopyShader.js',
      'src/public/js/three/shaders/HorizontalBlurShader.js',
      'src/public/js/three/shaders/VerticalBlurShader.js',
      'src/public/js/three/shaders/GodrayShaders.js',
      'src/public/js/three/postprocessing/ShaderPass.js',
      'src/public/js/three/postprocessing/EffectComposer.js',
      'src/public/js/three/postprocessing/MaskPass.js',
      'src/public/js/three/postprocessing/RenderPass.js',
      'src/public/js/tween/tween.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('js', function () {
  return gulp.src('src/public/js/app.js')
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
  gulp.watch('src/public/js/*.js', ['js']);
  gulp.watch('src/public/js/three/**/*', ['libs']);
  gulp.watch('src/public/js/tween/*.js', ['libs']);
  gulp.watch('src/public/assets/**/*', ['assets']);
  gulp.watch('src/public/css/*', ['css']);
});

gulp.task('default', ['watch', 'assets', 'libs', 'css', 'js']);

