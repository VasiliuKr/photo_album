'use strict';

var photoEditDelete = ( function() {
  var init = function(form) {
    _setUpListeners(form);
  };

  var _setUpListeners = function(form) {
    $('.button--icon-delete', form).on('click', openDeleteForm);
    $('.edit-photo__button-cancel', form).on('click', cancelDelete);
  };

  var cancelDelete = function() {
    $('.edit-photo .edit-photo__delete').css({ 'z-index': '-1', opacity: '0' });
  };

  var openDeleteForm = function() {
    $('.edit-photo .edit-photo__delete').css({ 'z-index': '1', opacity: '1' });

    var deleteForm = $('.edit-photo__delete form');

    var ajaxFormParam = {
      onGetAjaxDone: _getAjax,
      onGetAjaxFail: _failAjax
    };
    deleteForm.ajaxForm(ajaxFormParam);
  };

  // вызовится в случае успешного удаления фото
  var _getAjax = function(json) {
  };

  // вызовится в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
  };

  return {
    init: init
  };
}());

