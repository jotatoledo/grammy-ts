const gulp = require('gulp');

const buildConfig = require('../../build.config');

gulp.task('copy', () => {
  return gulp.src(['LICENSE', 'README.md', 'package.json']).pipe(gulp.dest(buildConfig.distRoot));
});
