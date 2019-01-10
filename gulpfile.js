let gulp = require('gulp');
let webserver = require('gulp-webserver');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
let handlebars = require('gulp-compile-handlebars');
let rename = require('gulp-rename');

let sass = require('gulp-sass');
sass.compiler = require('node-sass');



// *************task for sass to css*****************//
gulp.task('css', function () {
  return gulp.src('dev/sass/design.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS()) 
    .pipe(rename('design.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/css'), { sourcemaps: true });
});


gulp.task('libs', function() {
  return gulp.src(['dev/js/vendors/smoothscroll.js', 'dev/js/vendors/wow.js'])
    .pipe(concat('libs.js'))
    .pipe(rename('libs.min.js'))
    .pipe(gulp.dest('public/assets/js/libs'));
});

// ************** task for  js minify and concat*******//
gulp.task('scripts', function() {
    return gulp.src('dev/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'));
});


// ****************task for hbs to html***************//
gulp.task('html', function () { 
    return gulp.src('dev/templates/pages/**.hbs')
        .pipe(handlebars({}, {
          ignorePartials: true,
          batch: ['dev/templates/partials']
        }))
        .pipe(rename({
          extname: '.html'
        }))
        .pipe(gulp.dest('public'));
});



// ****************task for watch******************//
gulp.task('watch', ['css','libs','scripts', 'html'], function (){
  gulp.watch('dev/sass/**/**.scss', ['css']);
  gulp.watch('dev/js/**/**.js', ['scripts','libs']);
  gulp.watch('dev/templates/**/**.hbs', ['html']);
});



// ******************gulp serve*****************//
gulp.task('serve', ['watch'], function () {
  return gulp.src('public')
    .pipe(webserver({
      port: 3000,
      livereload: true,
      fallback: 'index.html'
    }));
});
