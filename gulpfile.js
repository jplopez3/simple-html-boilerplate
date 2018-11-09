var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');

var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
var uglify = require('gulp-uglify-es').default; //For ES6 format
var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
sass.compiler = require('node-sass');

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcSASS: 'src/sass/styles.scss',
  srcJS: 'src/**/*.js',

  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/css/',
  tmpJS: 'tmp/**/*.js',

  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

/**
 * DEVELOPMENT
 */
gulp.task('default', ['watch']);
gulp.task('copy', ['html', 'sass', 'js']);
gulp.task('watch', ['serve'], function () {
  gulp.watch(paths.src, ['inject']);
});
gulp.task('serve', ['inject'], function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});
gulp.task('inject', ['copy'], function () {
  console.log(paths.tmp+'/css/');
  var css = gulp.src(paths.tmp+'/css/');
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(inject(js, {
      relative: true
    }))
    .pipe(gulp.dest(paths.tmp));
});
gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});
/*gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});*/
gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('sass', function () {

  return gulp.src(paths.srcSASS)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.tmpCSS));
});
/**
 * DEVELOPMENT END
 */


/**
 * PRODUCTION
 */
gulp.task('build', ['inject:dist']);
gulp.task('copy:dist', ['html:dist', 'css:dist', 'sass:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(inject(js, {
      relative: true
    }))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('sass:dist', function () {
  console.log(paths.srcSASS);
  return gulp.src(paths.srcSASS)
    /*
     outputStyle:
       :nested
       :compact
       :expanded
       :compressed
     */
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
/**
 * PRODUCTION END
 */
gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});