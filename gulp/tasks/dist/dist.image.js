'use strict';

module.exports = function() {
  $.gulp.task('dist.image', function() {
    return $.gulp.src('./source/images/**/*.*')
    //.pipe($.gp.smushit())
      .pipe($.gulp.dest($.config.dist + '/assets/img'));
  });
};
