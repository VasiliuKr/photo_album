'use strict';

module.exports = function() {
  $.gulp.task('watch.dist:ivan', function() {
    $.gulp.watch('./build/assets/js/**/*.js', $.gulp.series(['dist.copy:js']));
    $.gulp.watch('./build/assets/css/**/*.css', $.gulp.series(['dist.copy:css']));
  });
};

