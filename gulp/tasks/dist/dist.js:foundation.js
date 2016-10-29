'use strict';

module.exports = function() {
  $.gulp.task('dist.js:foundation', function() {
    return $.gulp.src($.path.jsFoundation)
      .pipe($.gp.concat('foundation.js'))
      .pipe($.gulp.dest($.config.dist + '/assets/js'))
  })
};
