'use strict';

$.fn.extend({
  animateCssAndRemove: function(animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass(animationName).one(animationEnd, function() {
      $(this).remove();
      if (callback) {
        callback();
      }
    });
  }
});
