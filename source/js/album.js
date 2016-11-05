'use strict';

var album = (function() {
  var albumCollection = [];
  var albumContainer = false;
  var albumCanEdit = false;
  var showAddModal = false;
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

    var data = albums.data;
    var user = albums.user;

    for (var i = 0; i < data.length; i++) {

      var album = {
        albumName: data[i].title, //название альбома
        albumDescription: data[i].description, // описание альбома
        albumImagesNumber: data[i].photos_count, // количество картинок в альбоме
        albumUrl: "/album/"+data[i]._id, // ссылка на альбом
        coverImage: data[i].dir+'/'+data[i].cover,// путь к картинке
        editUrl: ""//ссылка на окно редактирования альбома  
      };

      if (albumCanEdit) {
        album.editUrl = "/album/edit/"+data[i]._id;
      }

      var album_item = templates.my_albums_item(album);
      albumContainer.append(album_item);  
    }

  };

  var init = function(params) {
    showAddModal = params.showAddModal;
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

  // вызовится в случае успеного сохранения формы
  var _getAjax = function(json) {
    popup.open({message:'Альбом создан'});
    modal.close();
    //Закрываем через 2 секунды
    setTimeout(popup.close, 2000);
  };

  // вызовится в случае ошибки отправки JSON на сервер
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

  return {
    init: init,
    set: setParam
  };
}());
