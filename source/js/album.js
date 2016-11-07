'use strict';

var album = (function() {
  var albumCollection = [];
  var albumUser = [];
  var albumContainer = false;
  var albumCanEdit = false;
  var showAddModal = false;
  var showEditModal = false;
  var errorMessageText = {
    title: 'Введите название альбома',
    description: 'Введите описание  альбома',
    cover: 'Выберите фаил для обдлжки',
    file_size: 'Превышен допустимый размер файла'
  };
  var setParam = function(albums, conteiner, canAdd) {
    albumContainer = $(conteiner);
    var addButton = albumContainer.parent().find('.button-circle--add');
    if (addButton.length > 0) {
      albumCanEdit = true;
      addButton.on('click', _addAlbum);
    }else{
      albumCanEdit = false;
    }

    albumCollection = albums.data;
    albumUser = albums.user;

    for (var i = 0; i < albumCollection.length; i++) {
      albumCollection[i].albumCanEdit = albumCanEdit;
      albumContainer.append(templates.my_albums_item(albumCollection[i]));
    }
  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    showEditModal = params.showEditModal;

    $('body').on('click', '.my-albums__item-edit-link', _editAlbum);
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

  // Вызывается после выбора обложки
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

  var _render = function(data) {

  };

  // вызовется в случае успеного сохранения формы
  var _getAjax = function(json) {
    popup.open({ message: json.message });
    modal.close();
    setTimeout(popup.close, 1000);

    var i = albumCollection.length;
    for (var j = 0; j < json.data.length; j++) {
      albumCollection[ i + j ] = json.data[j];
      albumCollection[ i + j ].albumCanEdit = albumCanEdit;
      albumContainer.prepend(templates.my_albums_item(albumCollection[ i + j ]));
    }
  };

  // вызовется в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
    popup.open( {message: 'Ошибка отправки данных на сервер'});
  };

  var _addAlbum = function(e) {
    e.preventDefault();
    var form = showAddModal();
    var ajaxFormParam = {
      onMessage: addMessage,
      onValidateUpdate: _updateValidateStatus,
      onFileChoose: _testFile,
      onGetAjaxDone: _getAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };

  var getAlbum = function(albumId) {
    for (var i = 0; i < albumCollection.length; i++ ) {
      if (albumCollection[i]._id === albumId) {
        return albumCollection[i];
      }
    }
    return false;
  };

  var _editAlbum = function(e) {
    e.preventDefault();

    var albumId = $(this).attr('code');
    var albumData = album.getAlbum(albumId);

    var form = showEditModal(albumData);
    var ajaxFormParam = {
      onMessage: addMessage,
      onValidateUpdate: _updateValidateStatus,
      onFileChoose: _testFile,
      onGetAjaxDone: _getAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };

  return {
    init: init,
    set: setParam,
    getAlbum: getAlbum
  };
}());
