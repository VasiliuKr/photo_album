'use strict';

var slider = (function() {
  var animations = 'animate-prev animate-next animate-next-current animate-prev-current';
  var photoBaza;
  var hereSlide;

  var init = function () {
    _setUpListeners();
  };

  var _setUpListeners = function () {
    $('body').on('click', '.slider__next', nextSlide);
    $('body').on('click', '.slider__prev', prevSlide);
    $('body').on('click', '.photo-albums__item-cover-wrapper,.photo-albums__item-comments', openSlider);

    $('body').on('click', '.slider__description-item--current .button--icon-like', setLike);
    $('body').on('submit', '.comments__form', addCommentOnSubmit);
  };

// Берем с сервера состояние лайка
  var initLike = function () {
    var url = '/ajax/ilike';

    $.post(url, function (data) {
      changeLikeClass(data.iLike);
    }).fail(function () {
      changeLikeClass(false);
    });
  };

  var changeLikeClass = function (like) {
    var likeButton = $('.slider__description-item--current').find('.button--icon-like');

    // console.log(likeButton.attr('class'));

    if (like) {
      likeButton.addClass('liked');
    } else {
      likeButton.removeClass('liked');
    }
  };

  var setLike = function () {
    event.preventDefault();

    var likeButton = $('.slider__description-item--current').find('.button--icon-like');
    var ilikeNew = false;
    if (!likeButton.hasClass('liked')) {
      ilikeNew = true;
    }
    changeLikeClass(ilikeNew);

    var url = '/ajax/ilike';
    $.post(url, {ilike: ilikeNew});
  };

  var openSlider = function () {
    event.preventDefault();
    // Устанавливаем слайд
    open($(this).closest('.photo-albums__item').index());
  };

  var open = function (curSlide) {
    modal.slider();

    hereSlide = curSlide;
    photoBaza = photo.getPhotos();

    var slidesNum = photoBaza.length;
    //Запрещаем слайдить если 1 фотка
    if (slidesNum===1) {
      $('.slider__prev,.slider__next').remove();
    }

    for (var i = 0; i < slidesNum; i++) {
      $('.slider__images').append(templates.slider_image(photoBaza[i]));

      var $description = $('<div />')
        .attr('class', 'slider__description-item')
        .append(templates.slider_description(photoBaza[i]));

      $('.slider__description').append($description);
    }
    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);

    // Анимация падения
    // $('.slider__description').css('top', 0);

    var imagesLoad = function () {
      setCurrentSlide(hereSlide);
    };
    // Ждем загрузку картинки текущего слайда
    $('.slider__images img').eq(hereSlide).on({
      load : imagesLoad,
      error: imagesLoad
    });
  };

  var _onGetComments = function (data) {
    var comments = data.comments;
    var users = {};

    var i;
    for(i = 0; i < data.users.length; i++){
      users[data.users[i]['_id']] = data.users[i];
    }

    var myId = data.myId;
    var commentData = users[myId];
    var $currentItem = $('.slider__description-item').eq(hereSlide);
    commentData.photoId = photoBaza[hereSlide]._id;

    //$currentItem.find('.comments').remove();
    $currentItem.append(templates.slider_comments(commentData));
    $currentItem.find('form').ajaxForm();

    for (var i = 0; i < comments.length; i++) {
      $currentItem
        .find('.comments__block')
        .append(templates.slider_comments_item(comments[i]));
    }
  };

// Берем с сервера инфу о комментах
  var loadComments = function (curSlide) {
    var url = '/ajax/comments/get';
    hereSlide = curSlide;
    myAjaxRequest.send(url, {id: photoBaza[hereSlide]._id}, _onGetComments);
  };

  var addCommentOnSubmit = function(event) {
    event.preventDefault();

    addComment($(this));
  };

// Добавляем комментарий
  var addComment = function(form) {
    var $input = form.find('.comments--text');

    var comment = {
      photo: photoBaza[hereSlide]._id,
      comment: $input.val()
    };

    var url = '/ajax/comments/add';
    myAjaxRequest.send(url, comment, function(data) {
      console.log(data.comments);
      if (data.comments) {
        $input.val('');
        var comments = data.comments;
        var users = data.users;

        // Пример структуры комментариев для 3 сущ-х юзеров
        // удалить, когда будет работать AJAX
        comments = [];
        users = photo.getUsers();

        users = Object.keys(users).map(function(key) { return users[key]; });

        for (var j = 1; j <= users.length; j++) {
          comments.push({user: users[j - 1], text: 'Новый Комментарий №' + j});
        }

        var $currentItem = $('.slider__description-item').eq(hereSlide);
        $currentItem.find('.comments__block').html('');

        for (var i = 0; i < comments.length; i++) {
          $currentItem
            .find('.comments__block')
            .append(templates.slider_comments_item(comments[i]));
        }
      }else{
        popup.open({message: 'Комментарий не добавлен.'});
      }
    });
  };

  var nextSlide = function(event) {
    event.preventDefault();

    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);

    // Получаем текущий слайд
    var curSlide = $('.slider__images-item--current');
    // Анимируем текущий слайд налево
    curSlide.addClass('animate-next-current');

    // Получаем следующий слайд
    var next = curSlide.next();

    // если текущий слайд не последний и имеет следующий слайд
    if (next.length) {
      // Анимируем следующий слайд налево
      next.addClass('slider__images-item--current animate-next');
      // Делаем следующий слайд текущим
      setCurrentSlide(next.index());
    }else{
      // Получаем первый слайд
      var first = $('.slider__images-item').eq(0);
      // Анимируем первый слайд налево
      first.addClass('slider__images-item--current animate-next');
      // Делаем первый слайд текущим
      setCurrentSlide(0);
    }
  };

  var prevSlide = function(event) {
    event.preventDefault();

    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);
    // Получаем текущий слайд
    var curSlide = $('.slider__images-item--current');
    // Анимируем текущий слайд направо
    curSlide.addClass('animate-prev-current');

    // Получаем предыдущий слайд
    var prev = curSlide.prev();

    // если текущий слайд не первый и имеет предыдущий слайд
    if (prev.length) {
      // Анимируем предыдущий слайд направо
      prev.addClass('slider__images-item--current animate-prev');
      // Делаем предыдущий слайд текущим
      setCurrentSlide(prev.index());
    }else{
      // Получаем последний слайд
      var last = $('.slider__images-item').last();
      // Анимируем последний слайд направо
      last.addClass('slider__images-item--current animate-prev');
      // Делаем последний слайд текущим
      setCurrentSlide(last.index());
    }
  };

  var setCurrentSlide = function(index) {
    // Устанавливаем текущий слайд по индексу
    $('.slider__images-item')
      .removeClass('slider__images-item--current')
      .eq(index)
      .addClass('slider__images-item--current');

    // Показываем описание в соответствии с индексом
    $('.slider__description-item')
      .removeClass('slider__description-item--current')
      .eq(index)
      .addClass('slider__description-item--current');

    // Устанавливаем состояние лайка
    // initLike($('.slider__description-item--current'));

    // Анимируем часть слайдера с описанием и комментариями
    $('.slider__description').css('top', $('.slider').height());

    loadComments(index);
  };

  return {
    open: open,
    init: init
  };
}());

