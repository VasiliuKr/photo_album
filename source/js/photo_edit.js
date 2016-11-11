'use strict';

var photoEditDelete = ( function() {
  var init = function(form) {
    _setUpListeners(form);
  };

  var _sendDel = function(e) {
    e.preventDefault();
    var $this = $(this);

    var ajaxParametr = {
      url: $this.attr('action'),
      method: 'POST',
      dataType: 'json',
      data: JSON.stringify($this.serializeObject()),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('content-type', 'application/json');
      }
    };

    $this.addClass('disabled');
    $this.find('[type=submit]').prop('disabled', true);
    $.ajax(ajaxParametr)
      .done(_getAjax)
      .fail(_failAjax);
  };

  var _setUpListeners = function(form) {
    $('.button--icon-delete', form).on('click', openDeleteForm);
    $('.edit-photo__button-cancel').on('click', cancelDelete);

    var deleteForm = $('.edit-photo__delete form');
    deleteForm.on('submit', _sendDel);
  };

  var cancelDelete = function() {
    $('.edit-photo__delete').css({ 'z-index': '-1', opacity: '0' });
  };

  var openDeleteForm = function() {
    $('.edit-photo__delete').css({ 'z-index': '1', opacity: '1' });
  };

  // вызовится в случае успешного удаления фото
  var _getAjax = function(json) {
    if(json.error) {
      popup.open({message: json.error});
    }else{
      modal.close();
      $('[data-photo-id=' + json.delete + ']').animateCssAndRemove('photo-delete');
    }
    cancelDelete();
    return false;
  };

  // вызовится в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
    popup.open({message: 'Ошибка отправки данных на сервер'});
    return false;
  };

  return {
    init: init
  };
}());

