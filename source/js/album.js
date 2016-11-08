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

      if ($(data.block).attr('id') === 'modal-cover') {
        $('.modal-cover__btn').removeClass('button--error');
      }else{
        $(data.block).removeClass('input--error');
      }
    }

    if(data.hasError && errorMessage.length === 0) {
      var errorData = {message: errorMessageText[data.name], className: data.name};
      errorMessage = templates.err_modal_line( errorData );
      $('.add-album .modal__errors').append(errorMessage);

      if ($(data.block).attr('id') === 'modal-cover') {
        $('.modal-cover__btn').addClass('button--error');
      }else{
        $(data.block).addClass('input--error');
      }
    }
  };

  // Вызывается после выбора обложки
  var _testFile = function(e) {
    if (e.loaded > 1024 * 1024 ) {
      _showErrorMessage( {name: 'file_size', hasError: true });
      $('#modal-cover').val('');
      $('.modal-cover__thumb').removeClass('modal-cover__thumb--active');
      $('.modal-cover__btn').addClass('button--error');
    }else{
      _showErrorMessage( {name: 'file_size', hasError: false });
      $('.modal-cover__thumb').addClass('modal-cover__thumb--active');
      $('.modal-cover__btn').removeClass('button--error');
      $('.modal-cover__thumb-img').attr('src', e.target.result);
    }
  };

  var _render = function(data) {

  };

  var _closeOnSuccess = function(msg) {
    modal.close();
    if (msg) {
      popup.open({ message: msg });
      setTimeout(popup.close, 1000);
    }
  };

  // вызовется в случае успешного сохранения формы добавления
  var _getAjax = function(json) {
    _closeOnSuccess(json.message);

    var i = albumCollection.length;
    for (var j = 0; j < json.data.length; j++) {
      albumCollection[ i + j ] = json.data[j];
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

  // Обновление массива альбомов
  var updateAlbum = function(albumId, data) {
    for (var i = 0; i < albumCollection.length; i++ ) {
      if (albumCollection[i]._id === albumId) {
        albumCollection[i] = data;
      }
    }
  };
  // вызовется в случае успешного сохранения редактирования
  var _getEditAjax = function(json) {
    _closeOnSuccess(json.message);

    var albumData = json.data[0];
    var albumId = albumData._id;

    updateAlbum(albumId, albumData);

    albumContainer
      .find('.my-albums__item[data-album-id="' + albumId + '"]')
      .html( $(templates.my_albums_item(albumData) ).children() );
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

    var albumId = parseInt($(this).attr('code'), 10);

    var albumData = getAlbum(albumId);

    var form = showEditModal(albumData);
    var ajaxFormParam = {
      onMessage: addMessage,
      onValidateUpdate: _updateValidateStatus,
      onFileChoose: _testFile,
      onGetAjaxDone: _getEditAjax,
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
