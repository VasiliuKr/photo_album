'use strict';

var slider = (function() {
  var animations = 'animate-prev animate-next animate-next-current animate-prev-current';

  var init = function() {
    _setUpListeners();
  };

  var _setUpListeners = function() {
    $('body').on('click', '.slider__next', nextSlide);
    $('body').on('click', '.slider__prev', prevSlide);
    $('body').on('click', '.photo-albums__item-cover-wrapper,.photo-albums__item-comments', openSlider);

    $('body').on('click', '.slider__description-item--current .button--icon-like', setLike);
  };

// Берем с сервера состояние лайка
  var initLike = function() {
    var url = '/ajax/ilike';

    $.post(url, function(data) {
      changeLikeClass(data.iLike);
    }).fail(function() {
      changeLikeClass(false);
    });
  };

  var changeLikeClass = function(like) {
    var likeButton = $('.slider__description-item--current').find('.button--icon-like');

    // console.log(likeButton.attr('class'));

    if (like) {
      likeButton.addClass('liked');
    }else{
      likeButton.removeClass('liked');
    }
  };

  var setLike = function() {
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

  var openSlider = function() {
    event.preventDefault();
    // Устанавливаем слайд
    open($(this).closest('.photo-albums__item').index());
  };

  var open = function(curSlide) {
    modal.slider();

    var images = photo.getPhotos();
    var users = photo.getUsers();
    var user = 1;
    var currentUser = users[user];

    var slidesNum = images.length;
    var i;
    for ( i = 0; i < slidesNum; i++) {
      $('.slider__images').append(templates.slider_image(images[i]));

      var $description = $('<div />')
        .attr('class', 'slider__description-item')
        // .attr('data-photo-id', images[i]._id)
        .append(templates.slider_description(images[i]))
        .append(templates.slider_comments(currentUser));

      // Пример структуры комментариев для 3 сущ-х юзеров
      images[i].comments = [
        {user: users[3], text: 'Комментарий №1'},
        {user: users[1], text: 'Комментарий №2'},
        {user: users[2], text: ''}
      ];

      var commentsNum = images[i].comments.length;
      commentsNum *= Math.random();// случайное от 0 до commentsNum

      for (var j = 0; j < commentsNum; j++) {
        var comment = images[i].comments[j];
        $description
          .find('.comments__block')
          .append(templates.slider_comments_item(comment));
      }

      $('.slider__description').append($description);
    }
    // Удаляем все анимации
    $('.slider__images-item').removeClass(animations);

    // Анимация падения
    // $('.slider__description').css('top', 0);

    i = 0;
    var imagesLoad = function() {
      i++;
      if (i === slidesNum) {
        setCurrentSlide(curSlide || 0);// индексация с нуля
      }
    };

    $('.slider__images img').on({
      load: imagesLoad,
      error: imagesLoad
    });
  };
  // имитация подгрузки
  var ajaxGetData = function(from, to) {
    return {};
  };
  // добавление данных в слайдер
  var addData = function(data) {
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

    // Догрузить данные перед последним
    /* if (next.length && !next.next().length) {
      var data = ajaxGetData(0, 0);
      addData(data);
    }*/

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
    initLike($('.slider__description-item--current'));

    // Анимируем часть слайдера с описанием и комментариями
    $('.slider__description').css('top', $('.slider').height());
  };

  return {
    open: open,
    init: init
  };
}());

