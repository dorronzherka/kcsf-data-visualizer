$(document).ready( function() {
    function openTutorial () {
        $("#tutorial-slideshow").owlCarousel({
            navigation: true, // Show next and prev buttons
            navigationText:
            ["back","next"],
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: true,
        });

        //get carousel instance data and store it in variable owl
        var owlCarousel = $("#tutorial-slideshow").data('owlCarousel');
        $('#tutorial-slideshow-modal').modal('show');

        $( ".btn-next-slide" ).click(function() {
            owlCarousel.next();
        });

        $( ".btn-done-tutorial" ).click(function() {
            $('#tutorial-slideshow-modal').modal('hide');
        });

        // Prevent background body from being scrolled
        $('body').css('overflow','hidden');
        $('body').css('width','100%');
    }


  $('img').imagesLoaded( function() {
    var info = $('#tour-info');

    $('#tourbus-demo-1').tourbus( {
      // debug: true,
      // autoDepart: true,
      onLegStart: function( leg, bus ) {
        info.html("Intro tour is on leg: " + (leg.index+1));

        // auto-progress where required
        if( leg.rawData.autoProgress ) {
          var currentIndex = leg.index;
          setTimeout(
            function() {
              if( bus.currentLegIndex != currentIndex ) { return; }
              bus.next();
            },
            leg.rawData.autoProgress
          );
        }
        // highlight where required
        if( leg.rawData.highlight ) {
          leg.$target.addClass('intro-tour-highlight');
          $('.intro-tour-overlay').show();
        }
        console.log(leg.index);
        if (leg.index == 0) {
            if ($('#show').hasClass('show')) {
                $('#show').click();
            }
        }
        if (leg.index != 0) {
            if ($('#show').hasClass('hide')) {
                $('#show').click();
            }
        }
        if (leg.index == 2) {
            $('.download-nav').attr('style', 'background-image:linear-gradient(to bottom, #157BB6 0, #269de5 100%) !important');
        }
        if (leg.index == 5) {
            if ($('#show').hasClass('hide')) {
                $('#show').click();
            }
            $('.highcharts-container').attr('style', 'position: relative;overflow: hidden;width: 1720px;height: 450px;text-align: left;line-height: normal;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);font-family: Exo;z-index:9999;');
        }
        if(leg.index != 5) {
            $('.highcharts-container').attr('style', 'position: relative;overflow: hidden;width: 1720px;height: 450px;text-align: left;line-height: normal;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);font-family: Exo;z-index:0;');
        }
        // if (leg.index == 5) {
        //     if ($('#show').hasClass('hide')) {
        //         $('#show').click();
        //     }
        // }

        // fade/slide in first leg
        if( leg.index == 0 ) {
          leg.$el
            .css( { visibility: 'visible', opacity: 0 } )
            .animate( {  opacity: 1.0 }, 500,
                      function() { leg.show(); } );
          return false;
        }
      },
      onLegEnd: function( leg ) {
        // remove highlight when leaving this leg
        // console.log(leg.index);
        // if (leg.index == 1) {
        //     if ($('#show').hasClass('show')) {
        //         $('#show').click();
        //     }
        // }
        // if (leg.index != 1) {
        //     if ($('#show').hasClass('hide')) {
        //         $('#show').click();
        //     }
        // }
        // if (leg.index == 3) {
        //     $('.download-nav').attr('style', 'background-image:linear-gradient(to bottom, #157BB6 0, #269de5 100%) !important');
        // }
        // if (leg.index == 4) {
        //     if ($('#show').hasClass('hide')) {
        //         $('#show').click();
        //     }
        //     $('.highcharts-container').attr('style', 'position: relative;overflow: hidden;width: 1720px;height: 450px;text-align: left;line-height: normal;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);font-family: Exo;z-index:9999;');
        // }
        // if(leg.index != 4) {
        //     $('.highcharts-container').attr('style', 'position: relative;overflow: hidden;width: 1720px;height: 450px;text-align: left;line-height: normal;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);font-family: Exo;z-index:0;');
        // }
        // if (leg.index == 5) {
        //     if ($('#show').hasClass('hide')) {
        //         $('#show').click();
        //     }
        // }
        if( leg.rawData.highlight ) {
          leg.$target.removeClass('intro-tour-highlight');
          $('.intro-tour-overlay').hide();
        }
      },
      onDepart: function() {
        info.html("Intro tour started!");
      },
      onStop: function() {
        info.html("Intro tour is inactive...");
      }
    } );

    $(document).on( 'click', '.help', function() {
        if (document.documentElement.clientWidth < 769) {
            openTutorial();
        }else {
            if ($('#show').hasClass('show')) {
                $('#show').click();
            }
            $('#tourbus-demo-1').trigger('depart.tourbus');
        }
    });

  });

  $('script.highlight').each( function() {
    var block = $(this);
    var code = $.trim( block.html() ).escape();
    var language = block.data('language');
    block = $("<pre class='language-" + language + "'><code>" + code + "</code></pre>").insertAfter(block);
    hljs.highlightBlock( block[0] );
  } );

} );

String.prototype.escape = function() {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return this.replace( /[&<>]/g, function( tag ) {
    return tagsToReplace[tag] || tag;
  } );
};
