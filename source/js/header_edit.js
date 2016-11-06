'use strict';

var headerEditor = (function() {
  var headerBlock;

  var _editorBlockOn = function(index, element) {
    var $element = $(element);

    switch ($element.attr('editor')) {
    case 'text_tag':
      $element.data('value', $element.html());
      $element.textEditor();
      break;
    case 'social':
      var href = $element.find('a').attr('href');
      $element.append(templates.social_edit({value: href, name: $element.attr('name')}));
      break;
    default:
    }
  };

  var _editorBlockOff = function(index, element) {
    var $element = $(element);

    switch ($element.attr('editor')) {
    case 'text_tag':
      $element.html($element.data('value'));
      $element.removeAttr('contenteditable');
      break;
    default:
    }
  };
  var _startEdit = function(e) {
    e.preventDefault();
    var buttonBlock = headerBlock.find('.profile__buttons');
    var editBlock = headerBlock.find('[name]');

    if(buttonBlock.hasClass('header-edit')) {
      buttonBlock.removeClass('header-edit');
      headerBlock.find('.header__wrapper').removeClass('header-edit');
      $('.page-wrap').removeClass('page-wrap--shadow');
      $.each(editBlock, _editorBlockOff);
    } else {
      buttonBlock.addClass('header-edit');
      headerBlock.find('.header__wrapper').addClass('header-edit');
      $('.page-wrap').addClass('page-wrap--shadow');
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
