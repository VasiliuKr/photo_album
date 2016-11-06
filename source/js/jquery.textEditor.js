'use strict';

(function($) {
  var editor;
  var defaults = {

  };

  function textEditor( element, options ) {
    this.textarea = $( element );
    this.config = $.extend({}, defaults, options);
    editor = this;
    this.init();
  }

  // text.replace(/(#[a-zA-Zа-яА-Я0-9]+)/g, '<span class="hashtag">$1</span>');
  textEditor.prototype.init = function() {
    this.textarea.prop('contenteditable', true);
    // this.textarea.on('keyup', _textareaKeyUp);
  };

  $.fn.textEditor = function(options) {
    $(this).each(function() {
      return new textEditor(this, options);
    });
    return this;
  };
})(jQuery);
