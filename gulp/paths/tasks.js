'use strict';

module.exports = [
  './gulp/tasks/sass.js',
  './gulp/tasks/sass.lint.js',
  './gulp/tasks/serve.js',
  './gulp/tasks/pug.js',
  './gulp/tasks/watch.js',
  './gulp/tasks/clean.js',
  './gulp/tasks/js.foundation.js',
  './gulp/tasks/css.foundation.js',
  './gulp/tasks/js.process.js',
  './gulp/tasks/js.lint.js',
  './gulp/tasks/copy.image.js',
  './gulp/tasks/sprite.svg.js',
  './gulp/tasks/sprite.png.js',
  './gulp/tasks/fonts.js',

  './gulp/tasks/dist/dist.css:foundation.js',
  './gulp/tasks/dist/dist.fonts.js',
  './gulp/tasks/dist/dist.image.js',
  './gulp/tasks/dist/dist.js:foundation.js',
  './gulp/tasks/dist/dist.js:process.js',
  './gulp/tasks/dist/dist.sass.js',
  './gulp/tasks/dist/dist.sprite:svg.js',
];

