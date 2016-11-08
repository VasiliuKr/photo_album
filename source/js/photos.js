'use strict';

var photo = (function() {
  var photoCollection = [];
  var userCollection = [];
  var photoContainer = false;
  var photoCanEdit = false;
  var showAddModal = false;
  var showEditModal = false;
  var photoOnPage = 12;
  var photoOnShowMore = 6;
  var lastPhotoNumer = 0;
  var errorMessageText = {
    title: 'Введите название альбома',
    description: 'Введите описание  альбома',
    cover: 'Выберите фаил для обдлжки',
    file_size: 'Превышен допустимый размер файла'
  };

  var showMorePhoto = function() {
    for (var i = 0; i < photoOnShowMore; i++) {
      photoCollection[i].photoCanEdit = photoCanEdit;
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
    lastPhotoNumer += photoOnShowMore;
  };

  var _showMoreClick = function(e) {
    e.preventDefault();
    photo.showMore();
  };

  var setParam = function(photos, conteiner, canAdd) {
    photoContainer = $(conteiner);
    var addButton = photoContainer.parent().find('.button-circle-icon--add');
    if (addButton.length > 0) {
      photoCanEdit = true;
      // addButton.on('click', _addphoto);
    }else{
      photoCanEdit = false;
    }

    var showMore = photoContainer.parent().find( '.show_more' );
    if(showMore.length > 0) {
      showMore.on('click', _showMoreClick);
      lastPhotoNumer = photoOnPage;
    }else{
      lastPhotoNumer = photos.data.length;
    }

    photoCollection = photos.data;
    userCollection = photos.user;

    for (var i = 0; i < lastPhotoNumer; i++) {
      photoCollection[i].photoCanEdit = photoCanEdit;
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    showEditModal = params.showEditModal;
    // _editPhoto();
    // _addPhoto();

    // $('body').on('click', '.класс редактирования фото', _editAlbum);
  };

  var _addPhoto = function(e) {
    e.preventDefault();
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
      onGetAjaxDone: _getAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };


  var _addFileToPost = function(data) {
    if(photosAdd.files.length < 1) {
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

  // вызовится в случае успеного сохранения формы
  var _getAjax = function(json) {
  };

  // вызовится в случае ошибки отправки JSON на сервер
  var _failAjax = function(json) {
  };

  return {
    init: init,
    set: setParam,
    showMore: showMorePhoto
  };
}());
