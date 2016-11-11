'use strict';

var likesPhoto = (function() {
  var likeUrl = '/ajax/like/set';

  var init = function() {
    $('body').on('click','[likeCode]',_testLike);
  };

  var _getLikeStatus = function (data) {
    var photoId = data.photoId;
    var likeElement = $('[likeCode' + photoId + ']');
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