var gulp = require('gulp'),
  sass = require('gulp-sass'),
  neat = require('node-neat'),
  styleguide = require('./dist/styleguide'),
  source = 'dist/app/**/*.scss',
  outputPath = 'demo-output';

gulp.task('styleguide:generate', function() {
  return gulp.src(source)
    .pipe(styleguide.generate({
        title: 'SC5 Styleguide',
        server: true,
        rootPath: outputPath,
        overviewPath: 'README.md',
        styleVariables: 'lib/app/sass/_styleguide_variables.scss'
      }))
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src('dist/app/sass/styleguide-app.scss')
    .pipe(sass({
      errLogToConsole: true,
      includePaths: neat.includePaths
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide', ['styleguide:static', 'styleguide:generate', 'styleguide:applystyles']);

gulp.task('styleguide:static', function() {
  gulp.src(['dist/demo/**'])
    .pipe(gulp.dest(outputPath + '/demo'));
});

gulp.task('watch', ['styleguide'], function() {
  // Start watching changes and update styleguide whenever changes are detected
  gulp.watch(source, ['styleguide']);
});
