'use strict';

(function() {
  modal.init();
  album.init( {showAddModal: modal.add_album});
  urlParser.init( pageTemplate.update );

  // modal.popup({message: 'messagecsddfd'});
  // modal.add_album();
  // modal.add_photo();
})();
