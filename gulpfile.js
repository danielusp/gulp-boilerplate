const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()

/**
 * Generates css for html body into include folder
 */
gulp.task('csshtml', () => {
    return gulp.src('./app/css/style.html.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename('style.php'))
      .pipe(gulp.dest('./app/includes'))
      .pipe(browserSync.stream())
});

/**
 * Generates a compact style.css
 */
gulp.task('sass', () => {
    return gulp.src(['./app/css/style.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.stream())
});

/**
 * Join all other .scss files into one called all.css
 */
gulp.task('pack-sass', () => {
    return gulp.src(['./app/css/*.scss','!./app/css/*.html.scss','!./app/css/style.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('all.css'))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.stream())
});

/**
 * Minify main.js
 */
gulp.task('js', () => {
    return gulp.src(['./app/js/main.js', '!./app/js/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
});

/**
 * Join all other .js files into one called all.min.js
 */
gulp.task('pack-js', () => {
    return gulp.src(['./app/js/*.js', '!./app/js/main.js', '!./app/js/*.min.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
});

/**
 * Look for changes in php files to reload the browser
 */
gulp.task('html', () => {
    return gulp.src('./app/**/*.php')
        .pipe(browserSync.stream())
})

/**
 * Run server, watch for changes and reload the browser
 */
gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: {
            target: "http://localhost/gulp-boilerplate/app/",
        }
    })

    gulp.watch('./app/css/style.html.scss', gulp.series('csshtml'))
    gulp.watch('./app/css/*.scss', gulp.series('sass'))
    gulp.watch('./app/css/*.scss', gulp.series('pack-sass'))
    gulp.watch('./app/js/main.js', gulp.series('js'))
    gulp.watch('./app/**/*.php', gulp.series('html'))
})

/**
 * Call all tasks with a simple $ gulp
 */
gulp.task('default', gulp.series('csshtml','sass','pack-sass','js','pack-js','html','browser-sync'))