'use strict';

module.exports = function() {
  $.gulp.task('sprite:png', function(cp) {
    var spriteData = $.gulp.src('./source/sprite/*.png')
    .pipe($.gp.spritesmith({
        imgName: 'assets/img/sprite.png',
        cssName: 'assets/css/sprite.css',
        cssFormat:'css',
        padding:30
    }));
    spriteData.img
      .pipe($.gulp.dest($.config.root+'/'));
    spriteData.css
      .pipe($.gp.csso())
      .pipe($.gulp.dest($.config.root+'/'));
    cp();
  })
};
