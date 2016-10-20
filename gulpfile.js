var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var pug = require('gulp-pug');
var inlinesource = require('gulp-inline-source');

var browserSync = require('browser-sync').create();

var sassFiles = 'src/sass/**/*';
var pugFiles = 'src/**/*.pug'
var excludes = ['{sass,sass/**}', '**/*.pug'];

gulp.task('default', ['watch']);

function sassTask() {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'));
}

gulp.task('sass', sassTask);

gulp.task('sass-and-reload', function(){
  return sassTask()
    .pipe(browserSync.stream());
});

gulp.task('pug', function(){
  return gulp.src(pugFiles)
    .pipe(pug())
    .pipe(gulp.dest('dist/'));
});

gulp.task('pug-and-reload', ['pug'], function(){
  browserSync.reload();
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

gulp.task('watch', ['move', 'sass', 'pug'], function(){
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(sassFiles, ['sass-and-reload']);
  gulp.watch(getMoveArray(), ['move-and-reload']);
  gulp.watch(pugFiles, ['pug-and-reload']);
});

gulp.task('move-and-reload', ['move'], function(){
  browserSync.reload();
});
