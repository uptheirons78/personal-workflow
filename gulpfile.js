const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

const styleSRC = 'src/scss/style.scss';
const styleDIST = './dist/css/';
const styleWatch = 'src/scss/**/*.scss';

const jsSRC = 'script.js';
const jsFolder = 'src/js/';
const jsDIST = './dist/js/';
const jsWatch = 'src/js/**/*.js';
const jsFILES = [jsSRC];

gulp.task('style', function() {
  gulp
    .src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      })
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styleDIST));
});

gulp.task('js', function() {
  jsFILES.map(function(entry) {
    //browserify
    return (
      browserify({
        entries: [jsFolder + entry]
      })
        //transform babelify[env]
        .transform('babelify', { presets: ['@babel/preset-env'] })
        //bundle
        .bundle()
        //source
        .pipe(source(entry))
        //rename .min
        .pipe(rename({ extname: '.min.js' }))
        //buffer
        .pipe(buffer())
        //sourcemap
        .pipe(sourcemaps.init({ loadMaps: true }))
        //uglify
        .pipe(uglify())
        //write sourcemap
        .pipe(sourcemaps.write('./'))
        //save in dist
        .pipe(gulp.dest(jsDIST))
    );
  });
});

gulp.task('default', ['style', 'js']);

gulp.task('watch', ['default'], function() {
  gulp.watch(styleWatch, ['style']);
  gulp.watch(jsWatch, ['js']);
});
