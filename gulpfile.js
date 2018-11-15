//variables
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
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

//css sources and destinations
const styleSRC = 'src/scss/style.scss';
const styleDIST = './dist/css/';
const styleWatch = 'src/scss/**/*.scss';

//js sources and destinations
const jsSRC = 'script.js';
const jsFolder = 'src/js/';
const jsDIST = './dist/js/';
const jsWatch = 'src/js/**/*.js';
const jsFILES = [jsSRC];

//html and php sources
const htmlWatch = '**/*.html';
const phpWatch = '**/*.php';

//browser-sync task
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

//style task
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
    .pipe(gulp.dest(styleDIST))
    .pipe(browserSync.stream());
});

//js task
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
        .pipe(browserSync.stream())
    );
  });
});

//gulp default task
gulp.task('default', ['style', 'js']);

//watch task
gulp.task('watch', ['default', 'browser-sync'], function() {
  gulp.watch(styleWatch, ['style']);
  gulp.watch(jsWatch, ['js', reload]);
  gulp.watch(htmlWatch, reload);
  gulp.watch(phpWatch, reload);
});
