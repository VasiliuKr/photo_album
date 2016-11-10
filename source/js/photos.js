'use strict';

var photoCollection1;

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

  var getPhoto = function(photoId) {
    for (var i = 0; i < photoCollection.length; i++ ) {
      if ( photoCollection[i]._id === photoId ) {
        return photoCollection[i];
      }
    }
    return false;
  };

  var _addTagEditInput = function(data) {
    var textBlock = $('.edit-photo [contenteditable]');
    data.data = JSON.parse(data.data);
    for (var i = 0; i < textBlock.length; i++) {
      data.data[$(textBlock[i]).attr('name')] = textBlock[i].innerText;
    }
    data.data = JSON.stringify(data.data);

    return data;
  };


  var _editPhoto = function(e) {
    e.preventDefault();
    var photoId = $(this).attr('code');
    var photoData = getPhoto(photoId);

    photoData.title = photoData.title || '';
    photoData.description = photoData.description || '';

    var form = showEditModal(photoData);
    photoEditDelete.init(form);
    form.find('div.modal__textarea').textEditor();
    form.find('div.modal__input').textEditor();
    var ajaxFormParam = {
      onValidateUpdate: _updateValidateStatus,
      beforeAjax: _addTagEditInput,
      onGetAjaxDone: _getEditAjax,
      onGetAjaxFail: _failAjax
    };
    form.ajaxForm(ajaxFormParam);

    return false;
  };

  var setParam = function(photos, conteiner, canAdd) {
    photoContainer = $(conteiner);
    var addButton = photoContainer.closest( 'section' ).find('.photo-albums__btn-add');

    var showMore = photoContainer.parent().find( '.show_more' );
    if(showMore.length > 0) {
      showMore.on('click', _showMoreClick);
    }

    if (photos.error) {
      $('.count-photos').text(0);
      return;
    }
    var i = 0;
    if (addButton.length > 0) {
      if (photos.data.length > 0 && photos.data[0].canEdit === 1) {
        typePhotoShow = 2;
        addButton.attr('code', photos.data[0].album_id);
        addButton.on('click', _addPhoto);
        photoContainer.on('click', '.my-albums__item-edit-link', _editPhoto);
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

    photoCollection = [];
    var totalLikes = 0;
    var totalComment = 0;

    for (i = 0; i < photos.data.length; i++) {
      userId = parseInt(photos.data[i].user, 10);
      photoCollection[i] = photos.data[i];
      photoCollection[i].user = userCollection[userId];
      photoCollection[i].typePhoto = typePhotoShow;
      photoCollection[i].title = tagsProcessor.convert(photoCollection[i].title);
      photoCollection[i].description = tagsProcessor.convert(photoCollection[i].description);
      totalLikes += photoCollection[i].likes;
      totalComment += photoCollection[i].comments;
    }

    $('.count-photos').text(photoCollection.length);
    $('.count-likes').text(totalLikes);
    $('.count-comments').text(totalComment);

    for (i = 0; i < photoOnPage && i < photoCollection.length; i++) {
      photoContainer.append(templates.photo_albums_item(photoCollection[i]));
    }
    lastPhotoNumber = i;
    showMoreHide();
  };

  var init = function(params) {
    showAddModal = params.showAddModal;
    showEditModal = params.showEditModal;
  };

  var _addPhoto = function(e) {
    e.preventDefault();
    var albumData = {
      id: $(this).attr('code'),
      title: $('h1.profile-album__title').text()
    };
    var form = showAddModal(albumData);
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
    var files = photosAdd.getFiles();
    if(files.length < 1) {
      popup.open({ message: 'Файлов для отправки нет' });
      // нужен вывод сообщения что файлов для отправки нет
      return false;
    }
    for (var i = 0; i < files.length; i++) {
      data.data.append('photos[]', files[i]);
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

      if ($(data.block).attr('id') === 'modal-cover') {
        $('.modal-cover__btn').removeClass('button--error');
      }else{
        $(data.block).removeClass('input--error');
      }
    }

    if(data.hasError && errorMessage.length === 0) {
      var errorData = {message: errorMessageText[data.name], className: data.name};
      errorMessage = templates.err_modal_line(errorData);
      $('.modal__errors').append(errorMessage);

      if ($(data.block).attr('id') === 'modal-cover') {
        $('.modal-cover__btn').addClass('button--error');
      } else {
        $(data.block).addClass('input--error');
      }
    }
  };

  var _closeOnSuccess = function(data) {
    modal.close();
    if (data.message) {
      popup.open({message: data.message});
      setTimeout(popup.close, 1000);
    }else {
      var j;
      var i;
      for ( j = data.length - 1; j >= 0; j-- ) {
        var photos = data[j];
        var photoId = photos._id;
        photos.user = photoCollection[0].user;
        photos.typePhoto = photoCollection[0].typePhoto;
        photos.title = tagsProcessor.convert(photos.title);
        photos.description = tagsProcessor.convert(photos.description);

        var newPhoto = templates.photo_albums_item(photos);
        // ищим в уже отображенных
        for (i = 0; i < photoCollection.length; i++) {
          if (photoCollection[i]._id === photoId) break;
        }

        photoCollection[i] = photos;
        if (i === photoCollection.length - 1) {
          // для новой фотки
          photoContainer.prepend(newPhoto);
        } else {
          // для уже отображенной
          var oldPhoto = $('[data-photo-id=' + photoId + ']');
          oldPhoto.before(newPhoto);
          oldPhoto.remove();
        }

        var totalLikes = 0;
        var totalComment = 0;
        for (i = 0; i < photoCollection.length; i++) {
          totalLikes += photoCollection[i].likes;
          totalComment += photoCollection[i].comments;
        }

        $('.count-photos').text(photoCollection.length);
        $('.count-likes').text(totalLikes);
        $('.count-comments').text(totalComment);
      }
    }
  };

  // вызовится в случае успеного сохранения формы
  var _getEditAjax = function(json) {
    _closeOnSuccess(json);
  };

  // вызовится в случае успеного сохранения формы
  var _getAjax = function(json) {
    _closeOnSuccess(json);
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
