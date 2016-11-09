'use strict';

var photoCollection1;

var photo = (function() {
  var photoCollection = [];
  var userCollection = [];
  var photoContainer = false;
  var photoCanEdit = false;
  var showAddModal = false;
  var showEditModal = false;
  var photoOnPage = 12;
  var photoOnShowMore = 6;
  var lastPhotoNumber = 0;
  var errorMessageText = {
    title: 'Введите название альбома',
    description: 'Введите описание  альбома',
    cover: 'Выберите файл для обложки',
    file_size: 'Превышен допустимый размер файла'
  };

  var showMoreHide = function() {
    if (lastPhotoNumber === photoCollection.length) {
      photoContainer.parent().find( '.show_more' ).hide();
    }
  };

  var showMorePhoto = function() {
    var i = lastPhotoNumber;
    for (; i < lastPhotoNumber + photoOnShowMore && i < photoCollection.length; i++) {
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
    lastPhotoNumber = i;
    showMoreHide();
  };

  var _showMoreClick = function(e) {
    e.preventDefault();
    photo.showMore();
  };

  var getUser = function(userId) {
    for (var i = 0; i < userCollection.length; i++ ) {
      if ( userCollection[i]._id === parseInt(userId, 10) ) {
        return userCollection[i];
      }
    }
    return false;
  };

  var setParam = function(photos, conteiner, canAdd) {
    photoContainer = $(conteiner);
    var addButton = photoContainer.parent().find('.photo-albums__btn-add');

    if (addButton.length > 0) {
      photoCanEdit = true;
      addButton.on('click', _addPhoto);
    }else{
      photoCanEdit = false;
    }

    var showMore = photoContainer.parent().find( '.show_more' );
    if(showMore.length > 0) {
      showMore.on('click', _showMoreClick);
    }

    photoCollection = photos.data;
    userCollection = photos.user;

    var i = 0;
    for (; i < photoOnPage && i < photoCollection.length; i++) {
      var userId = photoCollection[i].user;
      photoCollection[i].avatar = getUser(userId).photo;
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
    lastPhotoNumber = i;
    showMoreHide();
  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    showEditModal = params.showEditModal;
    // _editPhoto();
    // _addPhoto();

    // $('body').on('click', '.photo-albums__btn-add', _addPhoto);
    // $('body').on('click', '.photo-albums__btn-add', _editAlbum);
  };

  var _addPhoto = function(e) {
   // e.preventDefault();
    var form = showAddModal();
    photosAdd.init(form);
    var ajaxFormParam = {
      onValidateUpdate: _updateValidateStatus,
      beforeAjax: _addFileToPost,
      onGetAjaxDone: _getAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };

  var _editPhoto = function(e) {
    // e.preventDefault();
    var form = showEditModal();
    photoEditDelete.init(form);
    var ajaxFormParam = {
      onValidateUpdate: _updateValidateStatus,
      beforeAjax: _addFileToPost,
      onGetAjaxDone: _getEditAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };

  var _addFileToPost = function(data) {
    if(photosAdd.files.length < 1) {
      popup.open({ message: 'Файлов для отправки нет' });
      // нужен вывод сообщения что файлов для отправки нет
      return false;
    }
    for (var i = 0; i < photosAdd.files.length; i++) {
      data.data.append('photos[]', photosAdd.files[i]);
    }

    return data;
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
      $('.add-photo .modal__errors').append(errorMessage);
    }
  };

  var _closeOnSuccess = function(msg) {
    modal.close();
    if (msg) {
      popup.open({ message: msg });
      setTimeout(popup.close, 1000);
    }
  };

  // вызовится в случае успеного сохранения формы
  var _getEditAjax = function(json) {
    _closeOnSuccess(json.message);
  };

  // вызовится в случае успеного сохранения формы
  var _getAjax = function(json) {
    _closeOnSuccess(json.message);
  };

  // вызовится в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
    popup.open( {message: 'Ошибка отправки данных на сервер'});
  };

  return {
    init: init,
    set: setParam,
    showMore: showMorePhoto
  };
}());
