'use strict';

module.exports = function() {
  $.gulp.task('dist.sass', function() {
    return $.gulp.src('./source/style/app.scss')
      .pipe($.gp.sass())
      .pipe($.gp.autoprefixer({ browsers: $.config.autoprefixerConfig }))
      .pipe($.gp.csso())
      .pipe($.gulp.dest($.config.dist + '/assets/css'))
  })
};
