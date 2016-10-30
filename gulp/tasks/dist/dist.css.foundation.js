'use strict';

module.exports = function() {
  $.gulp.task('dist.css:foundation', function() {
    return $.gulp.src($.path.cssFoundation)
      .pipe($.gp.concatCss('foundation.css'))
      .pipe($.gp.csso())
      .pipe($.gulp.dest($.config.dist + '/assets/css'))
  })
};
