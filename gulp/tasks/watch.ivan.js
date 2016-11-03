'use strict';

module.exports = function() {
  $.gulp.task('watch:ivan', function() {
    $.gulp.watch('./source/js/**/*.js', $.gulp.series([/*'js:lint',*/'js:process']));
    $.gulp.watch('./source/style/**/*.scss', $.gulp.series([/*'sass.lint',*/'sass']));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.series(['frontend.jade','pug']));
    $.gulp.watch('./source/images/**/*.*', $.gulp.series('copy:image'));
    $.gulp.watch('./source/sprite/**/*.svg', $.gulp.series('sprite:svg'));
    $.gulp.watch('./source/sprite/**/*.png', $.gulp.series('sprite:png'));
  });
};

