'use strict';

module.exports = function() {
  $.gulp.task('dist.copy:js', function() {
    return $.gulp.src($.config.root + '/assets/js/**/*.js', { since: $.gulp.lastRun('dist.copy:js') })
      .pipe($.gulp.dest($.config.dist + '/assets/js'));
  });
};
