var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var inlinesource = require('gulp-inline-source');

var browserSync = require('browser-sync').create();

var srcPaths = {
  html: 'src/*.html',
  js: 'src/js/*.js',
  sass: 'src/sass/**/*.sass'
};

var distPaths = {
  html: 'dist/',
  js: 'dist/js/',
  css: 'dist/css/'
};

gulp.task('default', ['watch']);

gulp.task('sass', function () {
  return gulp.src(srcPaths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(distPaths.css))
    .pipe(browserSync.stream());
});

gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
  .pipe(clean());
});

gulp.task('inject', function(){
  return gulp.src(srcPaths.html)
      .pipe(inlinesource())
      .pipe(gulp.dest(distPaths.html));
});

gulp.task('move', ['move-html', 'move-js']);

gulp.task('move-html', function(){
  return gulp.src([srcPaths.html])
    .pipe(gulp.dest(distPaths.html));
});

gulp.task('move-js', function(){
  return gulp.src([srcPaths.js])
    .pipe(gulp.dest(distPaths.js));
});

gulp.task('watch', ['move', 'sass'], function(){
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(srcPaths.sass, ['sass']);
  gulp.watch(srcPaths.html, ['bsReload']);
  gulp.watch(srcPaths.js, ['bsReload']);
});

gulp.task('bsReload', ['move'], function(){
  browserSync.reload();
});
