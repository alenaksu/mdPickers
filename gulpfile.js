"use strict";

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    ngHtml2Js = require('gulp-ng-html2js'),
    minifyHtml = require('gulp-minify-html'),
    angularFilesort = require('gulp-angular-filesort'),
    ngAnnotate = require('gulp-ng-annotate'),
    path = require('path');


var outputFolder = 'dist/';
var moduleName = 'mdPickers';

gulp.task('assets', function() {
    return gulp.src(['src/core/**/*.less', 'src/components/**/*.less'])
        .pipe(concat('mdPickers.less'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(outputFolder))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(gulp.dest(outputFolder));
});

gulp.task('html2js', function() {
    return gulp.src('src/components/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "mdPickers"
        }))
        .pipe(concat("mdPickers.templates.js"))
        .pipe(uglify())
        .pipe(gulp.dest('src'));
});

gulp.task('build-app', ['html2js'], function() {
    return gulp.src(['src/mdPickers.js', 'src/core/**/*.js', 'src/components/**/*.js', 'src/mdPickers.templates.js'])
        .pipe(ngAnnotate())
        .pipe(concat('mdPickers.js'))
        .pipe(wrap('(function() {\n"use strict";\n<%= contents %>\n})();'))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(outputFolder))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['assets', 'build-app']);
});

gulp.task('default', ['assets', 'build-app']);
