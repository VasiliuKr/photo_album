'use strict';

var photo = (function() {
  var photoCollection = [];
  var userCollection = [];
  var photoContainer = false;
  var showAddModal = false;
  var showEditModal = false;
  // 0 - пустой левый угол
  // 1 - аватарку пользователя
  // 2 - редактировать
  var typePhotoShow = 0;
  var photoOnPage = 12;
  var photoOnShowMore = 6;
  var lastPhotoNumber = 0;
  var errorMessageText = {
    title: 'Введите название альбома',
    description: 'Введите описание  альбома',
    cover: 'Выберите файл для обложки',
    file_size: 'Превышен допустимый размер файла'
  };

  var getPhotos = function() {
    return photoCollection;
  };

  var getUsers = function() {
    return userCollection;
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

  var setParam = function(photos, conteiner, canAdd) {
    photoContainer = $(conteiner);
    var addButton = photoContainer.parent().find('.photo-albums__btn-add');

    var showMore = photoContainer.parent().find( '.show_more' );
    if(showMore.length > 0) {
      showMore.on('click', _showMoreClick);
    }

    var i = 0;
    if (addButton.length > 0) {
      if (photos.data.length > 0 && photos.data[0].canEdit === 1) {
        typePhotoShow = 2;
        addButton.on('click', _addPhoto);
        photoContainer.on('click', '.photo-albums__btn-add', _editPhoto);
      }else{
        typePhotoShow = 0;
        addButton.remove();
      }
    }else{
      typePhotoShow = 1;
    }

    userCollection = {};
    var userId;
    for (i = 0; i < photos.user.length; i++) {
      userId = parseInt(photos.user[i]._id, 10);
      userCollection[userId] = photos.user[i];
    }
// console.log(photos);
    photoCollection = [];
    for (i = 0; i < photos.data.length; i++) {
      userId = parseInt(photos.data[i].user, 10);
      photoCollection[i] = photos.data[i];
      photoCollection[i].user = userCollection[userId];
      photoCollection[i].typePhoto = typePhotoShow;
    }

    for (i = 0; i < photoOnPage && i < photoCollection.length; i++) {
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
    lastPhotoNumber = i;
    showMoreHide();
  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    showEditModal = params.showEditModal;

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
    showMore: showMorePhoto,
    getPhotos: getPhotos,
    getUsers: getUsers
  };
}());
