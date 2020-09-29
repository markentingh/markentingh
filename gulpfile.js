'use strict';

//includes
var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('less', function () {
    var p = gulp.src('style.less')
        .pipe(less());
    return p.pipe(gulp.dest('.', { overwrite: true }));
});

//watch task
gulp.task('watch', function () {
    gulp.watch('style.less', gulp.series('less'));
});