(function($) {
  Drupal.behaviors.pictureLazyload = {
    attach: function(context, settings) {
      // Ensure we always pass a raw DOM element to picture fill, otherwise it
      // will fallback to the document scope and maybe handle to much.
      $('.picture', context).once('picture-lazyload').waypoint(function() {
        $(this).attr('data-picture', '');
        window.picturefill(this);
      }, { offset: '100%', triggerOnce: true });
      Drupal.pictureLazyload.pictureColorbox(context);
    }
  };

  Drupal.pictureLazyload = Drupal.pictureLazyload || {};

  // Copied from picture.js
  Drupal.pictureLazyload.pictureColorbox = function(context) {
    // If this is an opened colorbox ensure the content dimensions are set
    // properly. colorbox.js of the colorbox modules sets #cboxLoadedContent
    // as context.
    if (context === '#cboxLoadedContent') {
      // Try to resize right away.
      $.colorbox.resize();
      // Make sure the colorbox resizes always when the image is changed.
      $('img', context).once('colorbox-lazy-load', function(){
        $(this).load(function(){
          // Ensure there's no max-width / max-height otherwise we won't get
          // the proper values. We could use naturalWeight / naturalHeight
          // but that's not supported by <IE9 and Opera.
          this.style.maxHeight = $(window).height() + 'px';
          this.style.maxWidth = $(window).width() + 'px';
          $.colorbox.resize({innerHeight: this.height, innerWidth: this.width});
          // Remove overwrite of this values again to ensure we respect the
          // stylesheet.
          this.style.maxHeight = null;
          this.style.maxWidth = null;
        });
      });
    }
  };
}(jQuery));

