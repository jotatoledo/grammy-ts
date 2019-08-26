const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const ignore = require('gulp-ignore');

const buildConfig = require('../../build.config');

const tsProject = ts.createProject(buildConfig.tsConfig, {
  declaration: true,
  // emitDeclarationOnly: true, // seems to be broken, nothing is emitted
  target: 'es5'
});

function renameEntryPoint(path) {
  if (path.basename.indexOf('index') > -1) {
    path.basename = path.basename.replace('index', buildConfig.libName);
  }
}

function fileIsJs(file) {
  return /^.*.js$/.test(file.basename);
}

gulp.task('generate-declaration-files', () => {
  return gulp
    .src(`${buildConfig.srcRoot}/**/*ts`)
    .pipe(tsProject())
    .pipe(ignore(fileIsJs))
    .pipe(rename(renameEntryPoint))
    .pipe(gulp.dest(buildConfig.distRoot));
});
