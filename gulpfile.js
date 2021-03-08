const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const del = require('del')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const replace = require('gulp-replace')
const browserSync = require('browser-sync').create()
const inject = require('gulp-inject');
const mustache = require("gulp-mustache");

// Current date to use as cache-buster or version control
const date = new Date()

/**
 * Mustache template
 */
gulp.task('mustache', () => {
    return gulp.src("./dev/templates/index.mustache")
    .pipe(mustache({
        title: "This is a mustache template generated",
        text: "Here is the text to fill mustache template. Looks good!"
    }))
    .pipe(rename({basename: 'index', extname: '.html'}))
    .pipe(gulp.dest("./app/"));
})

gulp.task('mustache-file', () => {
    return gulp.src("./dev/templates/file.mustache")
    .pipe(mustache('./dev/mustache-values.json',{},{}))
    .pipe(rename({basename: 'file', extname: '.html'}))
    .pipe(gulp.dest("./app/"));
})

/**
 * Injects a HTML markup inside another HTML
 */
gulp.task('inject-html', () => {
    return gulp.src('./dev/index.php')
    .pipe(inject(gulp.src(['./dev/partials/link.html']), {
      starttag: '<!-- inject:link -->',
      transform: function (filePath, file) {
        // return file contents as string
        return file.contents.toString('utf8')
      }
    }))
    .pipe(gulp.dest('./app/'));
})

/**
 * Generates css for html body into include folder
 */
gulp.task('csshtml', () => {
    return gulp.src('./dev/css/style.html.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename('style.php'))
      .pipe(gulp.dest('./app/includes'))
      .pipe(browserSync.stream())
})

/**
 * Generates a compact style.css
 */
gulp.task('sass', () => {
    return gulp.src(['./dev/css/style.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.stream())
})

/**
 * Join all other .scss files into one called all.css
 */
gulp.task('pack-sass', () => {
    return gulp.src(['./dev/css/*.scss','!./dev/css/*.html.scss','!./dev/css/style.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('all.css'))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.stream())
})

/**
 * Minify main.js and generate a .map file to better browser inspect
 */
gulp.task('js', () => {
    return gulp.src(['./dev/js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
})


/**
 * Transpile ES6 js pattern to older version
 * This example doesn't minify the final js file
 */
gulp.task('babel', () => {
    return gulp.src('./dev/js/es6Pattern.js')
        .pipe(babel({
            presets:['@babel/env']
        }))
        .pipe(rename('es6-babel.js'))
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
})

/**
 * Join all other .js files into one called all.min.js
 */
gulp.task('pack-js', () => {
    return gulp.src(['./dev/js/*.js', '!./dev/js/main.js', '!./dev/js/es6Pattern.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
})

/**
 * Compress images
 */
gulp.task('img', () => {
    return gulp.src('./dev/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./app/img'))
        .pipe(browserSync.stream())
})

/**
 * Cache burster
 * Insert a parameter in css and js callers to break cache
 */
gulp.task('cache-burster', () => {
    return gulp.src(['./dev/index.php'])
      .pipe(replace(/src\=\"(.*\.js)\"/g, 'src="$1?v='+date.getTime().toString()+'"'))
      .pipe(replace(/href\=\"(.*\.css)\"/g, 'href="$1?v='+date.getTime().toString()+'"'))
      .pipe(gulp.dest('./app/'))
      .pipe(browserSync.stream())
})

/**
 * Look for changes in php files to reload the browser
 */
gulp.task('html', () => {
    return gulp.src('./dev/**/*.php')
        .pipe(browserSync.stream())
})

/**
 * Clear Gulp generated files
 */
gulp.task('clear', () => {
    return del([
            'app/css/*.css',
            'app/includes/style.php',
            'app/js/*.min.js',
            'app/js/*.map',
            'app/js/es6-babel.js',
            'app/img/*',
            'app/*.php',
            'app/*.html'
        ])
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

    gulp.watch('./dev/css/style.html.scss', gulp.series('csshtml'))
    gulp.watch('./dev/css/*.scss', gulp.series('sass'))
    gulp.watch('./dev/css/*.scss', gulp.series('pack-sass'))
    gulp.watch('./dev/js/es6Pattern.js', gulp.series('babel'))
    gulp.watch('./dev/js/main.js', gulp.series('js'))
    gulp.watch('./dev/img-src/*', gulp.series('img'))
    gulp.watch('./dev/*.php', gulp.series('cache-burster'))
    gulp.watch('./dev/**/*.php', gulp.series('html'))
    gulp.watch('./dev/index.php', gulp.series('inject-html'))
})

/**
 * Call all tasks with a simple $ gulp
 */
gulp.task('default', gulp.series('mustache','mustache-file','csshtml','sass','pack-sass','js','babel','pack-js','img','cache-burster','html','inject-html','browser-sync'))