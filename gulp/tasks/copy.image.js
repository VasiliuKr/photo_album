'use strict';

module.exports = function() {
  $.gulp.task('copy:image', function() {
    return $.gulp.src('./source/images/**/*.*', { since: $.gulp.lastRun('copy:image') })
      //.pipe($.gp.smushit())
      .pipe($.gulp.dest($.config.root + '/assets/img'));
  });
};
