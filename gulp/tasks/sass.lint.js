'use strict';

module.exports = function() {
  $.gulp.task('sass.lint', function(){
    return $.gulp.src('./source/style/**/*.scss')
      .pipe($.gp.scssLint({
        customReport: sass_lint_reporter,
        config: './gulp/lint/sass.lint.yml'
      }))
      .on("error", $.gp.notify.onError({
        title:'scss-lint'
      }));
  });
};

var sass_lint_reporter = function(file, stream) {
  if (!file.scsslint.success) {
    var count_error=0;
    var count_warning=0;
    file.scsslint.issues.forEach(function(result) {
      var msg =
        $.gp.util.colors.blue("scss-lint ")+
        ('error' === result.severity ? $.gp.util.colors.red('[E]: ') : $.gp.util.colors.yellow('[W]: ')) +
        file.relative+' '+
        $.gp.util.colors.blue('Line:' + (result.line) + ' ' + " ") +
        $.gp.util.colors.green(result.linter ? (result.linter + ': ') : '') +
        result.reason;
      console.log(msg);
      if('error' === result.severity)
        count_error++;
      else
        count_warning++;
    });

    if(count_error)
      stream.emit('error', new $.gp.util.PluginError('scss-lint', 'Has '+count_error+' ERROR.', { showProperties: false}));
  }
};