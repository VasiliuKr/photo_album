'use strict';

var headerEditor = (function() {
  var headerBlock;

  var _editorBlockOn = function(index, element) {
    var $element = $(element);

    switch ($element.attr('editor')) {
    case 'text':
    case 'text_tag':
      $element.data('value', $element.html());
      $element.textEditor();
      break;
    case 'social':
      var href = $element.find('a').attr('href');
      $element.append(templates.social_edit({value: href.replace('mailto:',''), name: $element.attr('name')}));
      $element.addClass('social-show');
      break;
    default:
    }
  };

  var _editorBlockOff = function(index, element) {
    var $element = $(element);
    $element.find('.social-edit').remove();

    switch ($element.attr('editor')) {
    case 'text':
    case 'text_tag':
      $element.html($element.data('value'));
      $element.removeAttr('contenteditable');
      break;
    case 'social':
      $element.find('.social-edit').remove();
      $element.removeClass('social-show');
      break;
    default:
    }
  };

  // Обработчик после выбора файла
  var _testFile = function(e, input) {
    var $input = $( input );
    var toImg = $input.attr('to_img');
    if(toImg) {
      toImg = $(toImg);
      if(input.name === 'avatar') {
        toImg = toImg.first();
        var $testImg = toImg.clone();
        toImg.parent().find('>.test-image').animateCssAndRemove('fade-out');
        $testImg.attr('src', e.target.result);
        $testImg.addClass('test-image');
        toImg.after($testImg);
      }else{
        toImg.find('>.test-image').animateCssAndRemove('fade-out');
        var testImg = $(templates.test_image());
        testImg.find('.test-image__image').css('background-image', 'url(' + e.target.result + ')');
        toImg.append(testImg);
      }
    }
  };


  // Вызывается перед отправкой аякса
  var _addFeilds = function(data) {
    var textBlock = $('#header [contenteditable]');

    if(data.data.append) {
      for (var i = 0; i < textBlock.length; i++) {
        data.data.append($(textBlock[i]).attr('name'), textBlock[i].innerText);
      }
    }

    return data;
  };

  // вызовется в случае успеного сохранения формы
  var _getAjax = function(json) {
  };

  // вызовется в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
    popup.open( {message: 'Ошибка отправки данных на сервер'});
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
      $('.test-image').animateCssAndRemove('fade-out');
      $('body').removeClass('popup-show');
    } else {
      buttonBlock.addClass('header-edit');
      headerBlock.find('.header__wrapper').addClass('header-edit');
      $('.page-wrap').addClass('page-wrap--shadow');
      $.each(editBlock, _editorBlockOn);
      $('body').addClass('popup-show');
      $('html, body').stop().animate({scrollTop:0}, '500');

      var ajaxFormParam = {
        onMessage: popup.open,
        onFileChoose: _testFile,
        beforeAjax: _addFeilds,
        onGetAjaxDone: _getAjax,
        onGetAjaxFail: _failAjax
      };
      $('#header form').ajaxForm( ajaxFormParam );
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
