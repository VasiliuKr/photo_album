'use strict';

var likesPhoto = (function() {
  var likeUrl = '/ajax/like/set';

  var init = function() {
    $('body').on('click', '[likeCode]', _testLike);
  };

  var _getLikeStatus = function(data) {
    if (data.error) {
      popup.open({message: data.error});
      return;
    }

    var photoId = data.photoId;
    var likeElement = $('[likeCode=' + photoId + ']');
    if(data.iLike) {
      likeElement.addClass('liked');
    }else{
      likeElement.removeClass('liked');
    }
    likeElement.find('span').text(data.likes);
    photo.updateLike(photoId, data.likes, data.iLike);
  };

  var _testLike = function(e) {
    e.preventDefault();
    var $this = $(this);
    var photoId = $this.attr('likeCode');


    var postData = {
      photoId: photoId
    };

    if ($this.hasClass('liked')) {
      postData.set = false;
    }else{
      postData.set = true;
    }

    myAjaxRequest.send(likeUrl, postData, _getLikeStatus);
  };

  return {
    init: init
  };
}());
