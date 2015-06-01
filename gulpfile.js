"use strict";

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

var outputFolder = 'dist/';

gulp.task('assets', function() {
  return gulp.src('src/mdDatePicker.less')
        .pipe(less())
        .pipe(gulp.dest(outputFolder))
        .pipe(rename({suffix: '.min'}))
        .pipe(minify())
        .pipe(gulp.dest(outputFolder));
});

gulp.task('build-app', function() {  
  return gulp.src('src/mdDatePicker.js')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(outputFolder))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputFolder));
});

gulp.task('default', ['assets', 'build-app']);