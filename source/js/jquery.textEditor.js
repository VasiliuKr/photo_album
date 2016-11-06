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

  if (window.getSelection && document.createRange) {
    var saveSelection = function(containerEl) {
      var range = window.getSelection().getRangeAt(0);
      var preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(containerEl);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      var start = preSelectionRange.toString().length;

      return {
        start: start,
        end: start + range.toString().length
      };
    };

    var restoreSelection = function(containerEl, savedSel) {
      var charIndex = 0, range = document.createRange();
      range.setStart(containerEl, 0);
      range.collapse(true);
      var nodeStack = [containerEl], node, foundStart = false, stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
          var nextCharIndex = charIndex + node.length;
          if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
            range.setStart(node, savedSel.start - charIndex);
            foundStart = true;
          }
          if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
            range.setEnd(node, savedSel.end - charIndex);
            stop = true;
          }
          charIndex = nextCharIndex;
        } else {
          var i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else if (document.selection) {
    var saveSelection = function(containerEl) {
      var selectedTextRange = document.selection.createRange();
      var preSelectionTextRange = document.body.createTextRange();
      preSelectionTextRange.moveToElementText(containerEl);
      preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
      var start = preSelectionTextRange.text.length;

      return {
        start: start,
        end: start + selectedTextRange.text.length
      }
    };

    var restoreSelection = function(containerEl, savedSel) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(containerEl);
      textRange.collapse(true);
      textRange.moveEnd("character", savedSel.end);
      textRange.moveStart("character", savedSel.start);
      textRange.select();
    };
  }

  var _textareaKeyUp = function(evt) {
    var regExpForUserGroup = /(^|\s)(@|#)(\w+)/ig;
    var valueOfTextarea = $(this).text();
    var valueOfQuery;
    var stripTag = valueOfTextarea.replace(/\n/g, "").replace(/<\/?[^>]+(>|$)/g, " ");

    if ( regExpForUserGroup.test(valueOfTextarea) ) {
      valueOfQuery = stripTag.replace(regExpForUserGroup, "$1<a href=\"/search/?tag=$3\">$2$3</a>");

      var selection = saveSelection($('#result')[0]);

      $('#result').html(valueOfQuery);

      restoreSelection($('#result')[0], selection);
    }

  };

  //text.replace(/(#[a-zA-Zа-яА-Я0-9]+)/g, '<span class="hashtag">$1</span>');
  textEditor.prototype.init = function() {
    this.textarea.prop('contenteditable', true);
    this.textarea.on('keyup', _textareaKeyUp);
  };

  $.fn.textEditor = function(options) {
    $(this).each(function() {
      return new textEditor(this, options);
    });
    return this;
  };
})(jQuery);
