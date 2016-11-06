'use strict';

var headerEditor = (function() {
  var headerBlock;
  var buttonBlock;

  var _startEdit = function() {
    if(buttonBlock.hasClass('edit')) {
      buttonBlock.removeClass('edit');
    } else {
      buttonBlock.addClass('edit');
    }
  };

  var init = function(header) {
    headerBlock = $(header);
    buttonBlock = headerBlock.find('.profile-buttons');
    headerBlock.on('click', '.button-circle', _startEdit);
  };

  return {
    init: init
  };
}());
