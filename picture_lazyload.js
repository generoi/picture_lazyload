(function($) {

  // Simple lazy load function which triggers the picture load.
  jQuery.fn.lazyLoad = function() {
    this.each(function() {
      var $this = $(this)
        .attr('data-picture', '') // Set the data-picture property on the picture
        .removeClass('spinner');
      window.picturefill($this.parent()[0]);

      // Add a class once the image has loaded so we can modify styles.
      function setLoaded() { $this.addClass('img-loaded'); }
      $this.find('img').on('load', setLoaded);
    });
    return this;
  };

  Drupal.behaviors.pictureLazyload = {
    attach: function(context, settings) {

      // Hook into flexslider and force the load.
      $('.flexslider').bind('start', Drupal.pictureLazyload.flexslider.start);
      // Dont automatically lazyload flexslider pictures as we manually do it
      // before rebuilding the slider. This way we know that the images exist.
      $('.flexslider .picture').addClass('lazyload-manual');

      // Ensure we always pass a raw DOM element to picture fill, otherwise it
      // will fallback to the document scope and maybe handle to much.
      $('.picture', context)
        .not('.lazyload-manual') // Dont load pictures tagged with manual loading.
        .once('picture-lazyload')
        .waypoint(function () { $(this).lazyLoad(); }, {
          offset: '90%', triggerOnce: true
        });

      if (context === '#cboxLoadedContent') {
        // Wrap colorbox iframes in .flex-video
        $('iframe', context).once('colorbox-flex-video').wrap('<div class="flex-video"></div>');
      }

      Drupal.pictureLazyload.pictureColorbox(context);
    }
  };

  Drupal.pictureLazyload = Drupal.pictureLazyload || {};

  Drupal.pictureLazyload.flexslider = {
    start: function(e) {
      var $slider = $(e.target)
        , slider = $slider.data('flexslider');

      $slider
        .find('.picture')
        .once('picture-lazyload')
        .lazyLoad();

      // Rebuild the slider.
      slider.setup();

      // Add .colorbox-iframe links which works like .colorbox-load but with
      // preconfigured values. This needs to run after the flexslider has been
      // initialized.
      $slider.find('.colorbox-iframe')
        .once('init-colorbox-load', function() {
          $(this).colorbox($.extend({}, Drupal.settings.colorbox, {
            iframe: true,
            innerWidth: 800,
            innerHeight: 400
          }));
        });
    }
  };

  // Copied from picture.js
  Drupal.pictureLazyload.pictureColorbox = function(context) {
    // If this is an opened colorbox ensure the content dimensions are set
    // properly. colorbox.js of the colorbox modules sets #cboxLoadedContent
    // as context.
    if (context === '#cboxLoadedContent') {
      // Try to resize right away.
      $.colorbox.resize();
      // Make sure the colorbox resizes always when the image is changed.
      $('img', context).once('colorbox-lazy-load', function() {
        $(this).load(function() {
          // Ensure there's no max-width / max-height otherwise we won't get
          // the proper values. We could use naturalWeight / naturalHeight
          // but that's not supported by <IE9 and Opera.
          this.style.maxHeight = $(window).height() + 'px';
          this.style.maxWidth = $(window).width() + 'px';
          $.colorbox.resize({
            innerHeight: this.height,
            innerWidth: this.width
          });
          // Remove overwrite of this values again to ensure we respect the
          // stylesheet.
          this.style.maxHeight = null;
          this.style.maxWidth = null;
        });
      });
    }
  };
}(jQuery));
