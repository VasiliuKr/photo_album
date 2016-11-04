'use strict';

(function() {
  modal.init();
  album.init( {showAddModal: modal.add_album});
  photo.init( {showAddModal: modal.add_photo});
  popup.init();
  urlParser.init( pageTemplate.update );

  // popup.open({message: 'messagecsddfd'});
  // modal.add_photo();
  // modal.add_album();
})();
