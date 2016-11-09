'use strict';

module.exports = function() {
  $.gulp.task('dist.copy:css', function() {
    return $.gulp.src($.config.root + '/assets/css/**/*.css', { since: $.gulp.lastRun('dist.copy:css') })
      .pipe($.gulp.dest($.config.dist + '/assets/css'));
  });
};
