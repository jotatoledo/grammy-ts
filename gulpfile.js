const gulp = require('gulp');
const gulpHub = require('gulp-hub');

var hub = new gulpHub('scripts/gulp/*.js');

gulp.registry(hub);
gulp.task('default', gulp.parallel("copy", "generate-declaration-files"));
