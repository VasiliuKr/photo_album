'use strict';

module.exports = function() {
  $.gulp.task('dist.js:process', function() {
    return $.gulp.src($.path.app)
      .pipe($.gp.concat('app.js'))
      .pipe($.gulp.dest($.config.dist + '/assets/js'))
  })
};
