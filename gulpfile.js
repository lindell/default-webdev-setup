var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var inlinesource = require('gulp-inline-source');

var browserSync = require('browser-sync').create();

var sassFiles = 'src/sass/**/*';
var excludes = ['{sass,sass/**}'];

gulp.task('default', ['watch']);

gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
  .pipe(clean());
});

gulp.task('inject', function(){
  return gulp.src('src/**/*.html')
      .pipe(inlinesource())
      .pipe(gulp.dest('dest/'));
});

function getMoveArray(){
  var move = ['src/**/*'];
  for(var exlude of excludes){
    move.push('!src/' + exlude);
  }

  return move;
}

gulp.task('move', function(){
  return gulp.src(getMoveArray())
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['move', 'sass'], function(){
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(sassFiles, ['sass']);
  gulp.watch(getMoveArray(), ['move-and-reload']);
});

gulp.task('move-and-reload', ['move'], function(){
  browserSync.reload();
});
