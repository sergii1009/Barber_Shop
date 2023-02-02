const {src, dest, series, watch} = require('gulp')
const scss = require('gulp-sass')
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const connect = require('gulp-connect');
const fileinclude = require('gulp-file-include');

const appPath = {
    scss: './app/scss/**/*.scss',
    js: './app/js/*.js',
    img: [
        './app/img/**/*.jpg',
        './app/img/**/*.png'
    ]
}
const destPath = {
    css: './dist/css/',
    js: './dist/js/',
    img: './dist/img/'
}

function image() {
    return src(appPath.img)
        // .pipe(imagemin())
        .pipe(rename(function (path) {
            return {
                dirname: path.dirname,
                basename: path.basename,
                extname: path.extname
            };
        }))
        .pipe(dest(destPath.img))
        .pipe(connect.reload())
}

function scssCompress() {
    return src(appPath.scss)
        .pipe(scss({
            // outputStyle: 'compressed'
        }))
        .pipe(dest(destPath.css))
        .pipe(connect.reload())
}

function html() {
    return src('./app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist/'))
        .pipe(connect.reload())
}

function jsMin() {
    return src(appPath.js)
        .pipe(uglify())
        .pipe(dest(destPath.js))
}

function server() {
    connect.server({
        name: 'Dev App',
        root: 'dist',
        port: 8080,
        livereload: true
    })
}

watch(['./app/**/*.html'], html);
watch(appPath.scss, scssCompress);
watch(appPath.js, jsMin);
watch(appPath.img, {events: 'add'}, image);

exports.default = series(scssCompress, image, html, jsMin, server)