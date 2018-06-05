var gulp = require('gulp'),
    less = require('gulp-less'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel');
    uglify = require('gulp-uglify');
    path = require('path')
    // watch = require('gulp-watch');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('clean-server-dev', function(){
    return del([path.resolve('../test/node_modules/structor/server')], {force: true});
});

gulp.task('clean-server', function(){
    return del(['../server'], {force: true});
});

gulp.task('build-server-dev', ['clean-server-dev'], function() {
    return gulp.src('../src-server/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(path.resolve('../test/node_modules/structor/server')));
});

gulp.task('build-server', ['clean-server'], function() {
    return gulp.src('../src-server/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('../server'));
});

//
// gulp.task('clean-client-less', function() {
//     return del(['../src/client/lib/bootstrap/css/custom'], {force: true});
// });
//
// gulp.task('build-client-less', ['clean-client-less'], function() {
//     var config = {
//         src: '../src/client/lib/bootstrap/less/bootstrap.less',
//         dest: '../src/client/lib/bootstrap/css/custom'
//     };
//     return gulp.src(config.src)
//         .pipe(less())
//         .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
//         .pipe(gulp.dest(config.dest, {overwrite: true}));
// });

