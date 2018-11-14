const gulp = require("gulp");
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const styleSRC = 'src/scss/style.scss';
const styleDIST = './dist/css/';
const styleWatch = 'src/scss/**/*.scss';

const jsSRC = 'src/js/script.js';
const jsDIST = './dist/js/';
const jsWatch = 'src/js/**/*.js';

gulp.task('style', function() {
  gulp.src(styleSRC)
      .pipe( sourcemaps.init() )
      .pipe( sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      }))
      .on( 'error', console.error.bind( console ) )
      .pipe( autoprefixer({
        browsers: ['last 2 versions'], 
        cascade: false 
      }))
      .pipe(rename({suffix: '.min' }))
      .pipe( sourcemaps.write( './' ))
      .pipe(gulp.dest(styleDIST));
});

gulp.task('js', function() {
  gulp.src( jsSRC )
      .pipe(gulp.dest( jsDIST ));
});


gulp.task( 'default', ['style', 'js'] );

gulp.task('watch', ['default'], function() {
  gulp.watch( styleWatch, ['style']);
  gulp.watch( jsWatch, ['js']);
});
