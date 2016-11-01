'use strict';

module.exports = function() {
  $.gulp.task('dist.fonts', function() {
    return $.gulp.src('./source/fonts/**/*.*')
      .pipe($.gulp.dest($.config.dist+'/assets/fonts/'));
  });
};