'use strict';

var album = (function() {
  var albumCollection = [];
  var albumContainer = false;
  var showAddModal = false;
  var errorMessageText = {
    title: 'Введите название альбома',
    description: 'Введите описание  альбома',
    cover: 'Выберите фаил для обдлжки',
    file_size: 'Превышен допустимый размер файла'
  };
  var setParam = function(albums, conteiner, canAdd) {

  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    _addAlbum();
  };

  var addMessage = function(message, className) {

  };

  var _updateValidateStatus = function(data) {
    data.name = data.block.attr('name');
    _showErrorMessage(data);
  };

  var _showErrorMessage = function(data) {
    var errorMessage = $('.error-message--' + data.name);
    if(!data.hasError && errorMessage.length > 0) {
      errorMessage.remove();
    }

    if(data.hasError && errorMessage.length === 0) {
      var errorData = {message: errorMessageText[data.name], className: data.name};
      errorMessage = templates.err_modal_line( errorData );
      $('.add-album .modal__errors').append(errorMessage);
    }
  };

  var _testFile = function(e) {
    if (e.loaded > 1024 * 1024 ) {
      _showErrorMessage( {name: 'file_size', hasError: true });
      $('#modal-cover').val('');
      $('.modal-cover__thumb').removeClass('modal-cover__thumb--active');
    }else{
      _showErrorMessage( {name: 'file_size', hasError: false });
      $('.modal-cover__thumb').addClass('modal-cover__thumb--active');
      $('.modal-cover__thumb-img').attr('src', e.target.result);
    }
  };

  var _addAlbum = function() {
    var form = showAddModal();
    form.ajaxForm({ onMessage: addMessage, onValidateUpdate: _updateValidateStatus, onFileChoose: _testFile });
  };

  return {
    init: init,
    set: setParam
  };
}());
