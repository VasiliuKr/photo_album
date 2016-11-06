'use strict';

var headerEditor = (function() {
  var headerBlock;

  var _editorBlockOn = function(index, element) {
    var $element = $(element);

    switch ($element.attr('editor')) {
    case 'text_tag':
      $element.textEditor();
      break;
    default:
    }
  };

  var _startEdit = function(e) {
    e.preventDefault();
    var buttonBlock = headerBlock.find('.profile__buttons');
    if(buttonBlock.hasClass('header-edit')) {
      buttonBlock.removeClass('header-edit');
      headerBlock.find('.header__wrapper').removeClass('header-edit');
      $('.page-wrap').removeClass('page-wrap--shadow');
    } else {
      buttonBlock.addClass('header-edit');
      headerBlock.find('.header__wrapper').addClass('header-edit');
      $('.page-wrap').addClass('page-wrap--shadow');
      var editBlock = headerBlock.find('[name]');
      $.each(editBlock, _editorBlockOn);
    }
  };

  var init = function(header) {
    headerBlock = $(header);
    headerBlock.on('click', '.button-circle--edit,.header-edit__cancel', _startEdit);
  };

  return {
    init: init
  };
}());
