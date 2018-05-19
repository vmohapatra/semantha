/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */
'use strict';

App.Views.SearchView = Backbone.Marionette.View.extend({
 
  feedback: '',
  vote: '',

  nanobarOptions: {
    bg: '#1F2427',
    // leave target blank for global nanobar
    target: document.getElementById('div_pageBody'),
    // id for new nanobar
    id: 'div_nautilusProgressbar'
  },
  
  /**
   * Attaches `this.el` to an existing element
   */
  el: $('body'), 
  
  /**
   * Automatically called upon instantiation
   * You make all types of bindings, excluding UI events, such as clicks, etc
   */
  initialize: function() {
    // every function that uses 'this' as the current object should be in here
    _.bindAll(this, 'render','addNewSearchEventCaptureInfo', 'disambigSearchResults', 'putPOIMarkerOnMap', 'putAllPOIMarkersOnMap',
      'removePOIMarkersFromMap', 'addSubsequentSearchEventCaptureInfo', 'utilCaptureEventInfoObj',
      'handleFilterAttributes', 'removeBrandFilter', 'getAttributeString', 'removeValueFromString',
      'setNautilusVersion', 'putVotingPop', 'showUpFeedback', 'showDownFeedback', 'displayHotelNotFoundMarker',
      'sendFeedback', 'ambigHelper','showTagTooltip','removeMissingHotelMarkerFromMap', 'getBounds',
      'addAllItemsToListView', 'addItemToListView', 'adjustListStyles', 'updateStickyHeaderTxt','updateClusterImage',
      'showDetailsPane', 'hideDetailsPane','updateDetailsPaneContent', 'resetHotelMapMarkers', 'removeAllItemsFromMap');

    this.nanobar = new Nanobar(this.nanobarOptions);

    //Initialize a collection for list items
    this.render();
  },
  
  /**
   * DOM events are bound to View methods. 
   * Backbone doesn't have a separate controller to handle such bindings 
   * It all happens in a View.
   */
  events: {
    'click .clickableTagCloseIcon, .clickableTag' : 'removeBrandFilter',
    'click #none_thumbup, #up_thumbup, #down_thumbup' : 'showUpFeedback',
    'click #none_thumbdown, #up_thumbdown, #down_thumbdown' : 'showDownFeedback',
    'click #lnk_sendVote' : 'sendFeedback',
    'click #ambig_thumbup, #ambigup_thumbup, #ambigdown_thumbup' : 'showAmbigUpFeedback',
    'click #ambig_thumbdown, #ambigup_thumbdown, #ambigdown_thumbdown' : 'showAmbigDownFeedback',
    'click #lnk_sendAmbig' : 'showAmbigFinalFeedback'
   },
  
  /**
   * Function in charge of rendering the entire view in this.el. 
   * Needs to be manually called by the user.
   */
  render: function() {},

  /**
   * Reset the styles and classes for map markers and selected list items
   */
  resetHotelMapMarkers: function() {
    //Update the list to show only one selected item
    var selectItems = $('div.resultItemSelected');
    if (selectItems.length > 0) {
      selectItems.each(function () {
        $(this).removeClass('resultItemSelected');
      });
    }

    var activeClickBubbles = $('div[clickbubble="1"]');
    if (activeClickBubbles.length > 0) {
      activeClickBubbles.each(function () {
        //Set the clas of target to normal on removing click bubble
        $(this).removeAttr('clickbubble');

        var attributeClass = $(this).attr('class');

        //Set the clas of target to normal on removing click bubble
        if( attributeClass === 'hotel_unavailable_high' || attributeClass === 'hotel_unavailable_highHover' ) {
          $(this).attr('class', 'hotel_unavailable_high');
        }
        else if( attributeClass === 'hotel_unavailable_medium'|| attributeClass === 'hotel_unavailable_mediumHover' ) {
          $(this).attr('class', 'hotel_unavailable_medium');
        }
        else if( attributeClass === 'hotel_unavailable_low'|| attributeClass === 'hotel_unavailable_lowHover' ) {
          $(this).attr('class', 'hotel_unavailable_low');
        }
        else if(attributeClass === 'priceMarkerHover'|| attributeClass === 'priceMarker'){
          $(this).attr('class', 'priceMarker');
        }
        else if(attributeClass === 'hotMarkerHover'|| attributeClass === 'hotMarker'){
          $(this).attr('class', 'hotMarker');
        }
        else if(attributeClass === 'hotUnavailableMarkerHover'|| attributeClass === 'hotUnavailableMarker'){
          $(this).attr('class', 'hotUnavailableMarker');
        }
        else if (attributeClass === 'hotel_available_high'|| attributeClass === 'hotel_available_highHover') {
          $(this).attr('class', 'hotel_available_high');
        }
        else if (attributeClass === 'hotel_available_medium'|| attributeClass === 'hotel_available_mediumHover') {
          $(this).attr('class', 'hotel_available_medium');
        }
        else if (attributeClass === 'hotel_available_low'|| attributeClass === 'hotel_available_lowHover') {
          $(this).attr('class', 'hotel_available_low');
        }
      });
    }
  },

  /**
   * Show the details pane
   */
  showDetailsPane: function() {
    var detailsPaneContainer = $('.details-pane-container');

    // Details pane does not exists or is already visible
    if (detailsPaneContainer === undefined || detailsPaneContainer.is(':visible')) {
      return;
    }

    if ($('#div_xsListToggleBtnContainer').css('display') !== 'none') {
      if ($('#div_mapAndListContainer').hasClass('active')) {
        detailsPaneContainer.css('margin-right','-90%');
      }
      else {
        detailsPaneContainer.css('margin-right','0%');
      }
    }
    else {
      detailsPaneContainer.css('margin-right','0%');
    }



    //IE 8 show details pane
    if($.browser.msie && $.browser.version === 8) {
      detailsPaneContainer.show().stop().animate({
        right: '0px'
      }, 500);
    }
    // Modern browsers
    else {
      detailsPaneContainer.show().stop().animate({
        right: '0%'
      }, 500);
    }
  },

  /**
   * Hide the details pane
   */
  hideDetailsPane: function() {
    var detailPaneContainer = $('.details-pane-container');

    // Already hidden
    if (detailPaneContainer === undefined || !detailPaneContainer.is(':visible')) {
      return;
    }
    
    //IE 8 hide details pane
    if($.browser.msie && $.browser.version === 8) {
      detailPaneContainer.stop().animate({
        right: '-600px'   
      }, 500).hide();
    }
    // Modern browser hide details pane
    else {
      detailPaneContainer.stop().animate({
        right: '-100%'
      }, 500).hide();
    }

    this.resetHotelMapMarkers(); 
  },
  
  /**
   * Update details pane view item 
   */
  updateDetailsPaneContent: function(data) {
      
    this.resetHotelMapMarkers();
    // Declare a new ItemView and link in the DetailsPaneItem item to the view
    App.detailsPaneView = new App.Views.DetailsPaneView({
        collection: new App.Collections.DetailsPane()
    });

    //Set the region in which details pane view is rendered
    App.detailsPaneRegion.show(App.detailsPaneView);
    App.detailsPaneView.collection.reset();
    var item = {};

    // Hotel not available in EAN
    if(data.missingHotelMessage != undefined) {
      item = {
        currentHotelId: null, //Current Hotel EAN ID for hotel
        currentHotelName: data.name, //Name to be displayed
        currentHotelExpediaId: 'missing-hotel', //Expedia ID of a given hotel
        currentHotelImage: data.imageUrl, //Travelnow hotel image
        currentHotelFullPrice: null, //Numerical Full price for a hotel for dated search
        currentHotelDiscountPrice: null,//Numerical Discount price for a hotel for dated search
        currentHotelDatelessPrice: null,//String indicating dates are mandatory for prices
        currentHotelStarRating: 'Unknown',//Star rating of an hotel
        currentHotelReviewSummaries: null,//Object storing review summaries
        currentHotelReviewScores: null,//Object storing review scores
        currentHotelReviewReasonToBelieve: null,//Object storing review reasonToBelieve
        previousHotelId: null,// EAN Id of the previous hotel in the list
        nextHotelId: null//EAN Id of the next hotel in the list
      };
    }
    else {
      //isDateless function is defined in CommonUtil.js
      if(isDateless()) {
        //Dateless search
        item = {
          currentHotelId: data.hotelId, //Current Hotel EAN ID for hotel
          currentHotelName: data.name, //Name to be displayed
          currentHotelExpediaId: data.ehotelId, //Expedia ID of a given hotel
          currentHotelImage: data.imageUrl, //Travelnow hotel image
          currentHotelFullPrice: null, //Numerical Full price for a hotel for dated search
          currentHotelDiscountPrice: null,//Numerical Discount price for a hotel for dated search
          currentHotelDatelessPrice: 'Choose dates to see price',//String indicating dates are mandatory for prices
          currentHotelStarRating: data.starRating,//Star rating of an hotel
          currentHotelReviewSummaries: null,//Object storing review summaries
          currentHotelReviewScores: null,//Object storing review scores
          currentHotelReviewReasonToBelieve: null,//Object storing review reasonToBelieve
          previousHotelId: null,// EAN Id of the previous hotel in the list
          nextHotelId: null//EAN Id of the next hotel in the list
        };
      }
      else {
        //Dated search
        item = {
          currentHotelId: data.hotelId, //Current Hotel EAN ID for hotel
          currentHotelName: data.name, //Name to be displayed
          currentHotelExpediaId: data.ehotelId, //Expedia ID of a given hotel
          currentHotelImage: data.imageUrl, //Travelnow hotel image
          currentHotelFullPrice: data.regularDisplayPrice, //Numerical Full price for a hotel for dated search
          currentHotelDiscountPrice: data.displayPrice,//Numerical Discount price for a hotel for dated search
          currentHotelDatelessPrice: '',//String indicating dates are mandatory for prices
          currentHotelStarRating: data.starRating,//Star rating of an hotel
          currentHotelReviewSummaries: null,//Object storing review summaries
          currentHotelReviewScores: null,//Object storing review scores
          currentHotelReviewReasonToBelieve: null,//Object storing review reasonToBelieve
          previousHotelId: null,// EAN Id of the previous hotel in the list
          nextHotelId: null//EAN Id of the next hotel in the list
        };     
      }  
    }

    App.detailsPaneView.addDetailsPaneContent(item);
    review.addReviewsToDetailsPane(App.detailsPaneView.collection);
  },

  /**
   * Add all items in the itemList into App.listView.
   * @param {Array} itemList - A list of hotels or clusters
   * @param {Boolean} containsPartials - Does the list contain the partial divider
   */
  addAllItemsToListView: function (itemList, containsPartials) {

    //Clear filters
    clearFilterCount();

    //If no items in result
    if (_.isEmpty(itemList)) {
      $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.none'));
      $('#div_sort').hide();
      $('#div_priceUpdateNotice').hide();
      $('.zeroCountComment').show();

      if (isQueryExactHotelSearch) {
        this.displayHotelNotFoundMarker(detailsOfExactMatchHotel);
        isQueryExactHotelSearch = false;
      }
      return;
    }

    $('#div_resultsList').css('display','block');

    var listType = '',
        clusterIdList = [],
        exactHotelData;

    // Add items to list view up to itemList.length or global maxResultCount
    for(var inViewCount = 0, itemListLength = itemList.length; inViewCount < itemListLength; inViewCount++) {
      var hotelData = this.addItemToListView(itemList[inViewCount], inViewCount, clusterIdList);
      if (hotelData != undefined) {
        exactHotelData = hotelData;
      }
    }

    if (_.isEmpty(clusterIdList)) {
      listType = 'hotel';
    }
    else {
      listType = 'hotelcluster';
    }

    var collectionSize = App.listView.collection.length;

    if (containsPartials) {
      collectionSize -= 1;
    }

    this.updateStickyHeaderTxt(listType, collectionSize);

    if (listType === 'hotel') {
      review.addReviewsToCollection(App.listView.collection);
    }
    else if (listType === 'hotelcluster') {
      this.updateClusterImage(clusterIdList.join('_'));
    }

    if (isQueryExactHotelSearch) {
      isQueryExactHotelSearch = false;

      if (exactHotelData != undefined) {
        setTimeout(function() {
          $('div[hotelid="'+ exactHotelData.itemExpediaId +'"]').trigger('mouseover').trigger('click').trigger('mouseout');
        },1000);
      }
      else {
        this.displayHotelNotFoundMarker(detailsOfExactMatchHotel);
      }

    }
  },
  
  /**
   * Add the list item to the list view
   *
   * @param item - Hotels/Cluster object to parse
   * @param itemIndex - Position of the Hotel/Cluster object in the list
   * @param clusterIdList - List to add ids to if item is a cluster
   * @return {Object} - Returns the item added if it was an exact hotel search, else returns null
   */
  addItemToListView: function(item, itemIndex, clusterIdList) {

    var exactHotelData,
        itemType = '',
        newItem;

    if (item.id) {
      itemType = 'hotel';
      newItem = this.createNewHotelItem(item);
    }
    else if (item.hotels) {
      itemType = 'hotelcluster';
      newItem = this.createNewClusterItem(item);
    }
    else {
     itemType = 'partialDivider';
     newItem = this.createNewPartialDivider();
    }


    if (newItem == undefined) {
      return null;
    }

    // Set hotel price markers
    if (itemType === 'hotel') {

      var hotelMarker = $('#' + newItem.itemId);

      // Set map marker classes according to order in list
      if(!_.isEmpty(newItem.itemFormattedPrice)) {
        if(itemIndex < priceMarkerNum) {
          newItem.itemMapContent.setOptions({className: "priceMarker",  content:'<span class="priceLabel"><nobr>' + newItem.itemFormattedPrice + '</nobr></span>' + '<span class="markerDot"></span>', id:newItem.itemId });
          hotelMarker.css('left',-parseInt(hotelMarker.width()/2));
          hotelMarker.parent().css('z-index', 5);
        }
        else if(itemIndex < priceMarkerNum + 10) {
          newItem.itemMapContent.setOptions({className: "hotel_available_medium",content:'', id: newItem.itemId});
          hotelMarker.parent().css('z-index', 4);
        }
        else {
          newItem.itemMapContent.setOptions({className: "hotel_available_low",content:'', id: newItem.itemId});
          hotelMarker.parent().css('z-index', 3);
        }
      }
      else {
        if (itemIndex < priceMarkerNum) {
          newItem.itemMapContent.setOptions({ className: "hotel_unavailable_high", id: newItem.itemId });
          hotelMarker.parent().css('z-index', 2);
        }
        else if (itemIndex < priceMarkerNum + 10) {
          newItem.itemMapContent.setOptions({ className: "hotel_unavailable_medium", id: newItem.itemId });
          hotelMarker.parent().css('z-index', 1);
        }
        else {
          newItem.itemMapContent.setOptions({ className: "hotel_unavailable_low", id: newItem.itemId });
          hotelMarker.parent().css('z-index', 0);
        }
      }

      // Update marker reference after changes
      hotelMarker = $('#' + newItem.itemId);

      //Set the hotmarker on exact hotel match
      if (this.isAvailableExactHotelMatch(newItem)){
        exactHotelData = newItem;
        if (newItem.itemFormattedPrice) {
          newItem.itemMapContent.setOptions({className: 'hotMarkerHover',  content:'<span class="priceLabel"><nobr>' + newItem.itemFormattedPrice + '</nobr></span>' + '<span class="markerDot"></span>', id:newItem.itemId,style:{zIndex: 45000000}});
          hotelMarker.css('left',-parseInt(hotelMarker.width()/2));
        }
        else {
          newItem.itemMapContent.setOptions({ className: 'hotUnavailableMarkerHover', id: newItem.itemId,style:{zIndex: 45000000} });
        }
      }

    }
    // Set cluster aggregation markers
    else if(itemType === 'hotelcluster') {
      clusterIdList.push(newItem.itemName);
      newItem.itemMapContent.setOptions({className: 'aggregationMarker', content:'<span class="aggregationMarkerCenter"></span>', id:newItem.itemId });

      //Call a function to do the adjustments to the aggregation marker
      //aggregationMapMarkerStyler(item, map);
    }

    App.listView.addItem(newItem);

    if (itemType === 'hotel') {
      //Adjusting styles has to be done after adding list item
      this.adjustListStyles();
    }

    // Return if this was a exact hotel match
    return exactHotelData;
  },

  /**
   * Test if the hotelItem is the exact hotel in the nautilus concepts and if it is
   * a valid hotel (it has a valid star rating)
   * @param {Object} hotelItem - A hotel model that has itemStarRating and itemExpediaId
   * @returns {Boolean}
   */
  isAvailableExactHotelMatch: function (hotelItem) {
    var starRating = parseInt(hotelItem.itemStarRating);
    return  nlpHotelIds != undefined &&
            hotelItem.itemExpediaId != undefined &&
            hotelItem.itemExpediaId == _.first(nlpHotelIds) &&
            starRating >= 1 &&
            starRating <= 5;
  },

  /**
   * Create a new Hotel item object from nautilus item
   * @param item
   * @returns {Object} New model of ResultListItem
   */
  createNewHotelItem: function (item) {

    if (item == undefined || item.center == undefined) {
      return;
    }

    var hotelCenter = new expedia.dmap.LatLong(item.center.lat, item.center.lng),
        price = (item.beforeDiscountPrice && item.afterDiscountPrice) ? {
          regularPrice: item.beforeDiscountPrice,
          discountPrice: item.afterDiscountPrice
        } : null;


    return {
      itemId: parseInt(item.id),
      itemName: item.name,
      itemPrice: price,
      itemStarRating: item.star,
      itemImage: item.thumbnail,
      itemMapContent: new Content(map, hotelCenter, {
        className: 'default_mapMarker', // on first load all markers are default_mapMarker
        events: {
          'click': function (event) {

            map.events.removeEventListener(expedia.dmap.Map.EVENT_CLICK, function() {
              App.searchView.hideDetailsPane();
            });

            event = event ? event : window.event;
            var target;
            if (typeof event.target == 'undefined') {
              target = $(event.srcElement);
            }
            else {
              target = $(event.target);
            }

            if(target.hasClass("priceLabel") || target.hasClass("markerDot") || target.hasClass("aggregationMarkerCenter")) {
              target = target.parent();
            }

            var selectedHotelItem = "#h" + target.attr("id");

            if (target.attr("clickbubble") == '1') {
              App.searchView.hideDetailsPane();
              $(selectedHotelItem).addClass("resultItemSelected");
              return;
            }

            App.searchView.showDetailsPane();

            getBriefContent(target);
            //On click on any map marker get the click bubble content and pass appropriate data (based on class of target) to click bubble
            $(selectedHotelItem).addClass("resultItemSelected");

            if (triggerByItem == 0) {
              resultListScroll(selectedHotelItem);
            }

            previoustag = target;
            target.attr('clickbubble', '1');
            if (oldzindex == 0) {
              oldzindex = parseInt(target.css("z-index")) + 10000000;
            }
            else {
              oldzindex = oldzindex + 10;
            }
            target.css("z-index", oldzindex);


          },

          'mouse_enter': function (event) {

            var itemMatch = App.listView.collection.findWhere({itemExpediaId: parseInt(item.id)});

            if (itemMatch == undefined) {
              return;
            }

            // Set hotel name
            var hoverTipName = itemMatch.get('itemName') || '';

            // Set Review info
            var reviewScore = itemMatch.get('itemReview'),
                hoverTipReviewStar = '<span class="starPlaceholder"><span class="value starPlaceholder">&nbsp;</span></span>',
                hoverTipReviewCount = getLocalizedString('hotel-finder.brief-content.no-reviews');

            if (reviewScore) {
              $("#spn_hoverTipReviewCount").addClass("hoverTipReviewCount");
              $("#spn_hoverTipReviewCount").css({"display":"inline-block"});
              var userReviewRating = Math.round(reviewScore.rating*2) * 5;

              hoverTipReviewCount = '(' +reviewScore.count +')';
              hoverTipReviewStar = '<span class="guestRating guestRating-lg"><span class="value stars' + userReviewRating + '"></span></span>';
              $("#spn_hoverTipReviewStar").css({"display":"inline-block"});
            }

            // Set star rating
            var itemStar = formatStarRating(itemMatch.get('itemStarRating')),
                hoverTipHotelStar = '<span class="hotelRating rating stars-lg ir"><span class="value stars' + itemStar + '"></span></span>';

            // Set price info
            var itemPrice = itemMatch.get('itemPrice'),
                hoverTipHotelPrice = '';

            if (itemPrice) {
              hoverTipHotelPrice = itemPrice.discountPrice;
              $("#spn_hoverTipHotelPrice").addClass("hoverTipHotelPrice");
              $("#spn_hoverTipHotelPrice").css({"color":"#0292D0","display":"inline-block"});
            }
            else {
              //This is to show limited availability text in case of dateless searches for hover
              if(isDateless()) {
                hoverTipHotelPrice = getLocalizedString('hotel-finder.limited-availability');
              }
              else {
                hoverTipHotelPrice = getLocalizedString('hotel-finder.no-rooms');
              }

              $("#spn_hoverTipHotelPrice").css({"color":"#999","display":"inline-block"});
            }

            // content is the HTML content. In this case, using a template DOM element instead of writing HTML directly
            document.getElementById('div_hoverTipHotelName').innerHTML = hoverTipName;
            document.getElementById('spn_hoverTipHotelStar').innerHTML = hoverTipHotelStar;
            document.getElementById('spn_hoverTipHotelPrice').innerHTML = hoverTipHotelPrice;
            document.getElementById('spn_hoverTipReviewCount').innerHTML = hoverTipReviewCount;
            document.getElementById('spn_hoverTipReviewStar').innerHTML = hoverTipReviewStar;


            event = event ? event : window.event;
            var target;
            if (typeof event.target == 'undefined') {
              target = $(event.srcElement);
            }
            else {
              target = $(event.target);
            }

            if(target.hasClass("priceLabel") || target.hasClass("markerDot") || target.hasClass("aggregationMarkerCenter")) {
              target = target.parent();
            }

            previoustag = target;
            if (target.attr("clickbubble") == '1') {
              return;
            }

            // Pass the content to hotel_available class targets click bubble hover
            if(target.hasClass("hotel_available_high")) {
              $(".hotel_available_high").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: $('#div_hoverContent').html()
              });
            }
            else if(target.hasClass("hotel_available_medium")) {
              $(".hotel_available_medium").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: $('#div_hoverContent').html()
              });
            }
            else {
              $(".hotel_available_low").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: $('#div_hoverContent').html()
              });
            }

            var selectedElementId = target.attr("id"),
                selectedHotelItem = "#h" + selectedElementId,
                selectedElement = document.getElementById(selectedHotelItem);

            $(selectedElement).addClass("resultItemSelected");
            $("#div_hoverContent").css("position", "relative").css("z-index", "999");

            if(target.hasClass("priceLabel") || target.hasClass("markerDot")) {
              target = target.parent();
            }

            //Chnage class of target to hover
            if (target.hasClass("hotel_available_high") || target.hasClass("hotel_available_highHover")) {
              target.attr("class", "hotel_available_highHover");
            }
            else if(target.hasClass("hotel_available_medium") || target.hasClass("hotel_available_mediumHover")) {
              target.attr("class", "hotel_available_mediumHover");
            }
            else if(target.hasClass("hotel_available_low") || target.hasClass("hotel_available_lowHover")) {
              target.attr("class", "hotel_available_lowHover");
            }
            else if(target.hasClass("priceMarker") || target.hasClass("priceMarkerHover")) {
              target.attr("class", "priceMarkerHover");
            }
            else if(target.hasClass("aggregationMarker")) {
              target.attr("class", "aggregationMarkerHover");
              $(target).css(target.attr("style"));
              var markerStyle = {};
              if($.browser.msie && $.browser.version<=8) {
                markerStyle = {
                  "background-color":  "#FA7447",
                  filter: "alpha(opacity=80)"
                };

                $(target).css(markerStyle);

                $(target).children().css("background-color","#FA5E29");
              }
              else {
                $(target).children().css("background-color","rgba(250, 94, 41, 1)");
              }
            }
            else if(target.hasClass("hotMarker") || target.hasClass("hotMarkerHover")) {
              target.attr("class", "hotMarkerHover");
            }
            else if(target.hasClass("hotUnavailableMarker") || target.hasClass("hotUnavailableMarkerHover")) {
              target.attr("class", "hotUnavailableMarkerHover");
            }
            else if(target.hasClass("hotel_unavailable_high") || target.hasClass("hotel_unavailable_highHover")) {
              target.attr("class", "hotel_unavailable_highHover");
            }
            else if(target.hasClass("hotel_unavailable_medium") || target.hasClass("hotel_unavailable_mediumHover")) {
              target.attr("class", "hotel_unavailable_mediumHover");
            }
            else if(target.hasClass("hotel_unavailable_low") || target.hasClass("hotel_unavailable_lowHover")) {
              target.attr("class", "hotel_unavailable_lowHover");
            }
          },

          'mouse_exit': function (event) {
            // remove the position to hide hoverBox
            deactive_tiptip();
            previoustag = undefined;
            event = event ? event : window.event;
            var target;
            if (typeof event.target == 'undefined') {
              target = $(event.srcElement);
            } else {
              target = $(event.target);
            }

            //console.log('out: ' + target.attr("class"));
            if(target.hasClass("priceLabel") || target.hasClass("markerDot") || target.hasClass("aggregationMarkerCenter")) {
              target = target.parent();
            }

            //Change the state of class to hover or normal based on click bubble
            if (target.hasClass("hotel_available_high") || target.hasClass("hotel_available_highHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_available_high");
              } else {
                target.attr("class","hotel_available_highHover");
              }
            }
            else if (target.hasClass("hotel_available_medium") || target.hasClass("hotel_available_mediumHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_available_medium");
              } else {
                target.attr("class","hotel_available_mediumHover");
              }
            }
            else if (target.hasClass("hotel_available_low") || target.hasClass("hotel_available_lowHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_available_low");
              } else {
                target.attr("class","hotel_available_lowHover");
              }
            }
            else if(target.hasClass("priceMarker") || target.hasClass("priceMarkerHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "priceMarker");
              } else {
                target.attr("class","priceMarkerHover");
              }
            }
            else if(target.hasClass("hotMarker") || target.hasClass("hotMarkerHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotMarker");
              } else {
                target.attr("class","hotMarkerHover");
              }
            }
            else if(target.hasClass("hotUnavailableMarker") || target.hasClass("hotUnavailableMarkerHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotUnavailableMarker");
              } else {
                target.attr("class","hotUnavailableMarkerHover");
              }
            }

            else if(target.hasClass("aggregationMarker")  || target.hasClass("aggregationMarkerHover"))
            {
              target.attr("class", "aggregationMarker");
              $(target).css(target.attr("style"));
              var markerStyle = {};
              if($.browser.msie && $.browser.version<=8) {
                markerStyle = {
                  "background-color":  "#02ADF7",
                  filter: "alpha(opacity=60)"
                };

                $(target).css(markerStyle);

                $(target).children().css("background-color","#0293D0");
              }
              else {
                $(target).children().css("background-color","rgba(2, 147, 208, 1)");
              }
            }
            else if(target.hasClass("hotel_unavailable_high") || target.hasClass("hotel_unavailable_highHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_unavailable_high");
              } else {
                target.attr("class","hotel_unavailable_highHover");
              }
            }
            else if(target.hasClass("hotel_unavailable_medium") || target.hasClass("hotel_unavailable_mediumHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_unavailable_medium");
              } else {
                target.attr("class","hotel_unavailable_mediumHover");
              }
            }
            else if(target.hasClass("hotel_unavailable_low") || target.hasClass("hotel_unavailable_lowHover"))
            {
              if (target.attr("clickbubble") != '1') {
                target.attr("class", "hotel_unavailable_low");
              } else {
                target.attr("class","hotel_unavailable_lowHover");
              }
            }

            var selectedElementId = target.attr("id");
            var selectedHotelItem = "#h" + selectedElementId;
            if (target.attr("clickbubble") == '1') {
              return;
            } else {
              //target.attr("class", "priceMarker");
              var selectedElement = document.getElementById(selectedHotelItem);
              $(selectedElement).removeClass("resultItemSelected");
            }
            hoverBox.setOptions({content: ''});

          }
        }
      }),
      itemFormattedPrice: item.afterDiscountPrice,
      itemSize: null,
      itemType: 'hotel',
      itemExpediaId: parseInt(item.id),
      itemReview: null,
      itemReasonToBelieve: null
    };
  },

  /**
   * Create a new Cluster item object from nautilus item
   * @param item
   * @returns {Object} New model of ResultListItem
   */
  createNewClusterItem: function (item) {

    if (item == undefined || item.regions == undefined) {
      return null;
    }

    var region = _.first(item.regions),
        clusterCenter = new expedia.dmap.LatLong(region.center.lat, region.center.lng),
        mapContent = new Content(map, clusterCenter, {
          className: 'aggregationMarker',
          events: {
            'click': function () {
              map.events.removeEventListener(expedia.dmap.Map.EVENT_CLICK, function () {
                App.searchView.hideDetailsPane();
              });

              centerBasedZoom(clusterCenter.lat, clusterCenter.lng);
            },

            'mouse_enter': function (event) {

              // content is the HTML content. In this case, using a template DOM element instead of writing HTML directly
              document.getElementById('div_hoverTipHotelName').innerHTML = region.name;

              var label = (item.hotels.length === 1)
                ? getLocalizedString('hotel-finder.hotels-in-cluster.single')
                : getLocalizedString('hotel-finder.hotels-in-cluster.multiple').replace('{0}', item.hotels.length);

              document.getElementById('spn_hoverTipHotelStar').innerHTML = label;
              document.getElementById('spn_hoverTipHotelPrice').innerHTML = '';
              $("#spn_hoverTipHotelPrice").css("display", "none");
              $("#spn_hoverTipReviewCount").css("display", "none");
              $("#spn_hoverTipReviewStar").css("display", "none");


              event = event ? event : window.event;
              var target = $(event.target) || $(event.srcElement);

              if (target.hasClass("priceLabel") || target.hasClass("markerDot") || target.hasClass("aggregationMarkerCenter")) {
                target = target.parent();
              }

              previoustag = target;
              if (target.attr("clickbubble") == '1') {
                return;
              }

              $(".hotel_available_low").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: $('#div_hoverContent').html()
              });

              var selectedElementId = target.attr('id');
              $('#' + selectedElementId).addClass('resultItemSelected');
              $('#div_hoverContent').css('position', 'relative').css('z-index', '999');

              if (target.hasClass("aggregationMarker")) {

                target.attr("class", "aggregationMarkerHover");
                $(target).css(target.attr("style"));
                var markerStyle = {};
                if ($.browser.msie && $.browser.version <= 8) {
                  markerStyle = {
                    "background-color": "#FA7447",
                    filter: "alpha(opacity=80)"
                  };

                  $(target).css(markerStyle);

                  $(target).children().css("background-color", "#FA5E29");
                }
                else {
                  $(target).children().css("background-color", "rgba(250, 94, 41, 1)");
                }
              }
            },

            'mouse_exit': function (event) {
              // remove the position to hide hoverBox
              deactive_tiptip();
              previoustag = undefined;

              event = event ? event : window.event;
              var target = $(event.target) || $(event.srcElement);

              if (target.hasClass("priceLabel") || target.hasClass("markerDot") || target.hasClass("aggregationMarkerCenter")) {
                target = target.parent();
              }

              if (target.hasClass("aggregationMarker") || target.hasClass("aggregationMarkerHover")) {
                target.attr("class", "aggregationMarker");
                $(target).css(target.attr("style"));
                var markerStyle = {};
                if ($.browser.msie && $.browser.version <= 8) {
                  markerStyle = {
                    "background-color": "#02ADF7",
                    filter: "alpha(opacity=60)"
                  };

                  $(target).css(markerStyle);

                  $(target).children().css("background-color", "#0293D0");
                }
                else {
                  $(target).children().css("background-color", "rgba(2, 147, 208, 1)");
                }
              }

              /*var selectedElementId = target.attr("id");
               var selectedHotelItem = "#h" + selectedElementId;
               if (target.attr("clickbubble") == '1') {
               return;
               }
               else {
               //target.attr("class", "priceMarker");
               var selectedElement = document.getElementById(selectedHotelItem);
               $(selectedElement).removeClass("resultItemSelected");
               }
               hoverBox.setOptions({content: ''});*/

            }
          }
        });

    return {
      itemId: region.id,
      itemName: region.name,
      itemPrice: null,
      itemStarRating: null,
      itemImage: null,
      itemMapContent: mapContent,
      itemFormattedPrice: null,
      itemSize: item.hotels.length,
      itemType: 'hotelcluster',
      itemExpediaId: region.id,
      itemReview: null,
      itemReasonToBelieve: null
    };
  },

  createNewPartialDivider: function () {
    return {
      itemType: 'partialDivider'
    };
  },

  /**
   * Returns a check-in date string of format YYYY-MM-DD
   * @param {Date} date Check in date object
   * @returns {string} Returns date string or empty string on error
   */
  getCheckinDateString: function (date) {

    if (date == null || !_.isDate(date)) {
      return '';
    }

    var checkInYear = date.getFullYear(),
        checkInMonth = parseInt(date.getMonth()) + 1,
        checkInDay = date.getDate();

    // On NaN, null, undefined, ...
    if (isNaN(checkInYear) || isNaN(checkInMonth) || isNaN(checkInDay)) {
      return '';
    }

    return checkInYear + '-' + checkInMonth + '-' + checkInDay;
  },
   
  /**
   * Update cluster images
   * @param {string} clusterIds - string of cluster names (ids) seperated by '_'
   */
  updateClusterImage: function (clusterIds) {
    if (clusterIds != null) {
      var clusterImageUrl = 'clusterImageMapping/' + clusterIds.replace(/\./g,'@');

      $.get(clusterImageUrl, function (data){
        for (var idx in data) {
          var clusterData = data[idx],
              thumbDiv = $('#thumb_'+clusterData['Cluster ID'].replace(/[,\.\s'\(\)]/g,'_')),
              clusterImage = '';
            
          thumbDiv.parent().removeClass('cluster-info').addClass('loadClusterPhoto');
          if (window.devicePixelRatio && window.devicePixelRatio > 1) {
            clusterImage = clusterData['Cluster Large Thumbnail'];
          }
          else {
            clusterImage = clusterData['Cluster Small Thumbnail'];
          }
          thumbDiv.append('<img src="" class="lazy img-responsive" style="display:block;" ' +
            'data-original="resources/img/temp/cluster/' + clusterImage + '" />');   
        }

        $('img.lazy').show().lazyload({
            container: $('#div_resultsList'),
            effect:'fadeIn',
            threshold : 150 
        });
          
        $('#div_resultsListContainer #div_resultsList div.cluster').not('[class~="loadClusterPhoto"]').removeClass('cluster-info').addClass('noClusterPhoto');
      });
    } 
  },

  /**
   * Update the sticky header text with the hotel count
   */
  updateStickyHeaderTxt: function(listType, inViewCount) {
    //console.log('update sticky header called');
    if (inViewCount === 0) {
      $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.none'));
      $('.zeroCountComment').show();
      $('#div_sort').hide();
      $('#div_priceUpdateNotice').hide();
    }
    else if(inViewCount === 1) {
      if(listType === 'hotelcluster') {
        $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.cluster.single'));
        $('#div_sort').hide();
        $('#div_priceUpdateNotice').hide();
      }
      else {
        $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.single'));
        $('#div_sort').show();
        $('#div_priceUpdateNotice').show();
      }
      $('.zeroCountComment').hide();
    }
    else if(inViewCount > 1) {
      if(listType === 'hotelcluster'){
        $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.cluster.multiple'));
        $('#div_sort').hide();
        $('#div_priceUpdateNotice').hide();
      }
      else {
        $('#div_listCount').text(getLocalizedString('hotel-finder.results-in-view.multiple').replace('{0}', inViewCount));
        $('#div_sort').show();
        $('#div_priceUpdateNotice').show();
      }
      $('.zeroCountComment').hide();
    }    
  },

  /**
   * Adjust list styles after addition of list item
   */
  adjustListStyles: function() {
    //This is to adjust positioning of hotel price & no room txt in case of dateless searches
    var dpFrom = $('#ip_dpfrom').val();
    var dpTo = $('#ip_dpto').val();
    if(dpFrom.indexOf('/') === -1 && dpTo.indexOf('/') === -1) {
      $('.promoDate').css('display','block');
    }
    else {  
      $('.promoDate').css('display','none');
    }
  },

  /**
   * Show truncated tag tooltip
   */
  showTagTooltip: function(txt, event) {
    event = event ? event : window.event;

    $('#div_tagContainer').qtip({
      overwrite: true,
      content: {
        text: '<div style="padding:5px;">' + txt + '</div>' 
      },
      position: {
        my: 'top left',
        at: 'bottom left',
        target: $(event.target), // Defaults to target element
        adjust: {x:0, y:13}
      },
      show: {
        event: 'mouseenter',
        target: $(event.target), // Defaults to target element
        ready: true
      },
      hide: {
        event: 'mouseleave',
        target: $(event.target), // Defaults to target element
        ready: true
      },
      style: {
        classes: 'qtip-tags',
        tip: {corner: false}
      }
    });  
  },

  /**
   * Populate the eventInfo object for Search event
   */
  utilCaptureEventInfoObj: function (obj) {
     obj['UV.AdultCount'] = capture.getAdultsCount();
     obj['UV.AggregationMode'] = capture.isAggregateMode();
     obj['UV.Amenities'] = capture.getAmenities();
     obj['UV.AutoSuggestVersion'] =  $('#spn_gemmaVersion').text();

     if($('#ip_dpfrom').val()) {
      if($('#ip_dpfrom').val().indexOf('/') === -1) {
        obj['UV.CheckinDate'] = '';
      }
      else {
        var checkinDate = new Date($('#ip_dpfrom').val());
        obj['UV.CheckinDate'] = checkinDate.format('yyyy-mm-dd');
      }
     }
    
     if($('#ip_dpto').val()) {
      if($('#ip_dpto').val().indexOf('/') === -1) {
        obj['UV.CheckoutDate'] = '';
      }
      else {
        var checkoutDate = new Date($('#ip_dpto').val());
        obj['UV.CheckoutDate'] = checkoutDate.format('yyyy-mm-dd');
      }     
     }

     obj['UV.ChildCount'] = capture.getChildrenCount();
     obj['UV.ClickedSuggestionRank'] = capture.getClickedSuggestionRank();
     obj['UV.ClickedClusterName'] = '';//TODO
     obj['UV.ClusterResultList'] = capture.getClusterList();
     obj['UV.HotelNameFilter'] = '';//TODO
     obj['UV.HotelResultList'] = capture.getHotelList();
     obj['UV.NLPParseQuery'] = $('#prg_searchMsg').text();//NLP understood text
     obj['UV.NLPParseTree'] = nautilusData;
     obj['UV.NumberOfResults'] = capture.getNumberOfResults();
     obj['UV.PartialSearchQuery'] = unescape(getOldQuery());//getOldQuery function defined in Semantha.js
     obj['UV.PriceFilter'] = capture.getPriceFilter();
     obj['UV.RoomCount'] = getRoomItems().length;//getRoomItems is defined in commonutils.js
     obj['UV.SearchQuery'] = this.getUserQuery();
     obj['UV.StarRatingFilter'] = capture.getStarRatingFilter();
     obj['UV.SuggestedQueries'] = capture.getSuggestedQueries();
     obj['UV.Themes'] = capture.getThemes();
     obj['UV.ViewPort'] = capture.getViewPort();

     return obj;
  },

  /**
   * Populate the new search event related info when it triggers a DMAP request
   * This capture will have a unique Search query ID as it is a new search query text
   * This function gets called only in the responseprocessed listener
   */
  addNewSearchEventCaptureInfo: function (typeOfSearch, eventTriggerer, eventType) {
    //Define variables related to event
    var eventInfo = {
      'UV.EventTrigger': eventTriggerer,  //this needs to be dynamic as per the event
      'UV.EventType': eventType,          //This needs to be event dependent
      'UV.SearchType': typeOfSearch       //Type of search
    };

    eventInfo = this.utilCaptureEventInfoObj(eventInfo);
    var capturePrevBrowserID = capture.getSearchQueryParams();
    if( capturePrevBrowserID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.BrowserGUID'] =  capturePrevBrowserID.BrowserGUID;
    }
    else {
      var captureCommonData = capture.captureCommonData();
      eventInfo['UV.BrowserGUID'] =  captureCommonData['UV.BrowserGUID'];
    }

    //Send capture request, return status
    return capture.sendCaptureRequest(eventInfo, eventTriggerer, true);  
  },

  /**
   * Populate the subsequent search event related info when it triggers a DMAP request
   * This capture will have the Search query ID of the previous text search, to tie the subsequent actions with the search.
   * In case there was no previous search text, it will generate a new searchQueryID
   * This function gets called only in the responseprocessed listener
   */
  addSubsequentSearchEventCaptureInfo: function (typeOfSearch, eventTriggerer, eventType) {
    //Define variables related to event
    var eventInfo = {
      'UV.EventTrigger': eventTriggerer, // This needs to be dynamic as per the event
      'UV.EventType': eventType,         // This needs to be event dependent
      'UV.SearchType': typeOfSearch      // Type of search
    };

    eventInfo = this.utilCaptureEventInfoObj(eventInfo);
    var capturePrevSearchID = capture.getSearchQueryParams();
    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
    else {
      var captureCommonData = capture.captureCommonData();
      eventInfo['UV.SearchQueryId'] = 'null';//If there is no search related to it the searchqueryId should be set as 'null'
      if(!_.isEmpty(capturePrevSearchID.BrowserGUID)) {
        //Use the previous GUID
        eventInfo['UV.BrowserGUID'] =  capturePrevSearchID['UV.BrowserGUID'];
      }
      else {
        //Get a new GUID
        eventInfo['UV.BrowserGUID'] =  captureCommonData['UV.BrowserGUID'];
      }
    }

    //Send capture request
    return capture.sendCaptureRequest(eventInfo, eventTriggerer, true);  
  },

  /**
   * Implement the user choice from the disambig window
   * This function gets called on selecting a result from the disambig options in the modal window
   */
  disambigSearchResults: function (data,result) {
    //Clear the previous data displayed on the map
    itemsvcHotel.clearItems();
    this.removeAllItemsFromMap();
    doNotClearMapMarkers = true;

    $('.nonClickableTag').remove();
    $('.clickableTag').remove();
    //Close the disambig popup
    $('#div_disambigDialog').dialog('close');
    var ambigSearchQuery,
        regex = new RegExp('\'', 'g');

    if(data.preferredEntity === 'REGIONS') {
      //Clear UI filters
      clearAmentityFilter();
      updateAmenityLabel();
      //Clear NLP data
      clearNLPData();
      if(typeof result !== 'undefined') {
        this.handleFilterAttributes(result);
      }
      isQueryExactHotelSearch = false;
      ambigSearchQuery = this.getUserQuery();

      var regionName = _.first(data.regions).name;
      this.feedback = 'Ambiguity resolved. Region selected: ' + regionName;
      
      if(!_.isEmpty(regionName) && regionName.length > 40) {
        var showRegion = regionName.substring(0,40);
       
        $('#div_tagContainer').before('<span class="nonClickableTag truncatedTag" tagData="' +
          regionName.replace(regex,'&#39;') + '" onmouseover="App.searchView.showTagTooltip(\'' +
            regionName.replace(regex,'&#39;') + '\', event)" >' + showRegion + '...</span>');
      }
      else if(!_.isEmpty(regionName) && regionName.length <= 40) {
        $('#div_tagContainer').before('<span class="nonClickableTag" tagData="' +
          regionName.replace(regex,'&#39;') + '">' + regionName + '</span>');
      }

      var nlpBrandNames = [];
      if(!_.isEmpty(nlpbrand)) {
        nlpBrandNames = nlpbrand.split(',');
      }
      var tempCount = 0;
      
      if (!_.isEmpty(nlpBrandNames)) {
        for (tempCount=0; tempCount < nlpBrandNames.length; tempCount++) {

          if(!_.isEmpty(nlpBrandNames[tempCount]) && nlpBrandNames[tempCount].length > 20) {
            var showBrand = nlpBrandNames[tempCount].substring(0,20);

            $('#div_tagContainer').before('<span class="clickableTag truncatedTag"  tagData="'+
              nlpBrandNames[tempCount].replace(regex,'&#39;') + '" onmouseover="App.searchView.showTagTooltip(\'' +
                nlpBrandNames[tempCount].replace(regex,'&#39;') + '\', event)" >' +
                  showBrand + '...<span class="clickableTagCloseIcon"></span></span>');
          }
          else if(!_.isEmpty(nlpBrandNames[tempCount]) && nlpBrandNames[tempCount].length <= 20) {
            $('#div_tagContainer').before('<span class="clickableTag" tagData="' + 
              nlpBrandNames[tempCount].replace(regex,'&#39;') + '" >' + nlpBrandNames[tempCount] +
              '<span class="clickableTagCloseIcon"></span></span>');
          }
        }
      }

      var regionCenter = lodash.get(data, 'regions[0].center');

      if (regionCenter != undefined) {
        centerBasedZoom(regionCenter.lat, regionCenter.lng);
      }

      if(data.regions[0].type === 'point_of_interest_shadow') {
        this.putPOIMarkerOnMap(data.regions[0], 'poiMarkerSpecial');
      }
    }
    else if(data.preferredEntity === 'HOTELS') {
      //Clear UI filters
      clearAmentityFilter();
      updateAmenityLabel();
      //Clear NLP data
      clearNLPData();
      //Set the hotel ID to the selected hotel ID
      nlpHotelIds[0] = data.hotels[0].id;
      isQueryExactHotelSearch = true;
      detailsOfExactMatchHotel.HOTEL = data.hotels[0].name;
      detailsOfExactMatchHotel.CENTER = data.hotels[0].center;        
      ambigSearchQuery = this.getUserQuery();
      this.feedback = 'Ambiguity resolved. Hotel selected: ' + data.hotels[0].name;
      
      if(!_.isEmpty(data.hotels[0].name) && data.hotels[0].name.length > 20) {
        var showHotel = data.hotels[0].name.substring(0,20);
        $('#div_tagContainer').before('<span class="nonClickableTag truncatedTag" tagData"' + 
          data.hotels[0].name.replace(regex,'&#39;') +'" onmouseover="App.searchView.showTagTooltip(\'' + 
            data.hotels[0].name.replace(regex, '&#39;') + '\', event)" >' + showHotel + '...</span>');
      }
      else if(!_.isEmpty(data.hotels[0].name) && data.hotels[0].name.length <= 20) {
        $('#div_tagContainer').before('<span class="nonClickableTag" tagData"' + 
          data.hotels[0].name.replace(regex,'&#39;') + '">' + data.hotels[0].name + '</span>');
      }
      var center = new expedia.dmap.LatLong(data.hotels[0].center.lat, data.hotels[0].center.lng);
      map.setCenter(center);
      map.setZoom(15);
    }
    
    var ambigoptions = '';
    $('#ul_disambigOptions li').each(function(){
      ambigoptions += $(this).text() + ' | ';
    });
    
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Ambig',                                  // This needs to be event dependent
      'UV.EventTrigger': 'AmbigSelection',                      // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                          // Raw Nautilus parse tree
      'UV.NLPVote': (typeof(this.vote) !== 'undefined') ? this.vote : '', // Up or Down
      'UV.NLPUserQuery': ambigSearchQuery,                      // Query by User
      'UV.NLPFeedback': '',                                     // Specific feedback by user
      'UV.NLPParseQuery': this.feedback,                        // NLP understood text
      'UV.AmbigOptions': ambigoptions,
      'UV.AmbigSelection': data.name
    };

    var capturePrevSearchID = capture.getSearchQueryParams();
    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
  
    //Send capture request
    capture.sendCaptureRequest(eventInfo, 'AmbigSelection', true); 
    
    //itemsvcHotel.makeRequests();
    itemsvcHotel.clearItemsRequests();
    this.putVotingPop();
    this.removeMissingHotelMarkerFromMap();
    return 'resolved';
  },

  /**
   * Calculate viewport from region center and top x hotels(bounding box)
   */
  getBounds: function (region, hotels) {
    var lat,
        lng,
        n = region.center.lat,
        e = region.center.lng,
        s = region.center.lat,
        w = region.center.lng;
    
    for(var i = 0; i < hotels.length; i++) {
      lat = hotels[i].center.lat;
      lng = hotels[i].center.lng;
      if (lat > n) {
        n = lat;
      }
      if (lat < s) {
        s = lat;
      }
      if (lng > e) {
        e = lng;
      }
      if (lng < w) {
        w = lng;
      }
    }

    return {
      NElat : n,
      NElng : e,
      SWlat : s,
      SWlng : w
    };
  },
  
  /**
   * Put single POI marker of type 'classname' on map, defaults to 'poiMarker'
   *
   * @param {Object} poi - Poi object
   * @param {string} classname - html classname to be assigned to marker, default 'poiMarker'
   */
  putPOIMarkerOnMap: function (poi, className) {
    var poiLat = poi.center.lat,
        poiLng = poi.center.lng,
        center = new expedia.dmap.LatLong(poiLat, poiLng),
        poiMapMarker = new Content(map, center, {
          id : poi.name,
          className : className || 'poiMarker',
          events: {
            'mouse_enter': function(event) {
              event = event || window.event;

              var target = $(event.target) || $(event.srcElement),
                  ele = document.getElementById(target.attr('id'));

              $(ele).tipTip({
                target: target,
                defaultPosition: 'right',
                maxWidth: '338px',
                content: target.attr('id')
              });
            },
            'mouse_exit' : function() {
              deactive_tiptip();
            }
          }
        });

    poiContent.push(poiMapMarker);             
  },
  
  /**
   * Put all POI markers on map and assigns the class 'poiMarker', i.e. non-special markers
   * @param {Array} pois - An array of poi objects
   */
  putAllPOIMarkersOnMap: function (pois) {
    pois.forEach(function (poi) {
      this.putPOIMarkerOnMap(poi, 'poiMarker');
    }, this);
  },
  
  /**
   * Remove all POI markers from map
   *
   * See removeAllItemsFromMap
   */
  removePOIMarkersFromMap: function() {
    poiContent.forEach(function (poi) {
      poi.remove();
    });

    poiContent = [];  
  },


  /**
   * Remove all items rendered on the map. Includes:
   *  POI Markers, Hotel Markers, Aggregation Markers
   */
  removeAllItemsFromMap: function () {
    // Remove POI flags
    this.removePOIMarkersFromMap();
    // Remove Hotel and cluster markers
    App.listView.collection.forEach(function (model) {
      var mapContent = model.get('itemMapContent');
      if (!_.isEmpty(mapContent)) {
        mapContent.remove();
      }
    });
  },

  /**
   * Display a marker for a hotel not found in the DMAP response
   */  
  displayHotelNotFoundMarker: function (notFoundHotelDetails) {
    var hotelLat = notFoundHotelDetails.CENTER.lat,
        hotelLng = notFoundHotelDetails.CENTER.lng,
        hotelName = notFoundHotelDetails.HOTEL, 
        center = new expedia.dmap.LatLong(hotelLat,hotelLng);   
    
    var missingHotel = new Content(map, center, {
      id : hotelName,
      className : 'missingHotelMarker',
      events: {
        'click' : function(event) {
          event = event ? event : window.event;
          var target;
          if (typeof event.target === 'undefined') {
            target = $(event.srcElement);
          } else {
            target = $(event.target);
          }

          if(target.hasClass('missingHotelMarker')) {
            //Check if details pane is already visible or not
            if($('.details-pane-container').css('right') !== '0px') {
              App.searchView.showDetailsPane();
            }

            if (target.attr('clickbubble') === '1') {
              App.searchView.hideDetailsPane();
            }
          }
        }
      }
    }); 
     
    var dataForMissingHotel = {
        hotelId : null,
        name : hotelName,
        ehotelId : 'missing-hotel',
        imageUrl : '',
        starRating : 'Unknown',
        regularDisplayPrice : null,
        displayPrice : null,
        missingHotelMessage : ''
    };
      
    this.updateDetailsPaneContent(dataForMissingHotel);
    this.showDetailsPane();
  },
  
  /**
   * Remove missing hotel marker from the map
   */
  removeMissingHotelMarkerFromMap: function() {
    if ($('.missingHotelMarker') != null) {
      $('div').remove('.missingHotelMarker');
    }
  },
  
  /**
   * Set ambig feedback and filter attributes
   * @param {Object} result - Semantha's Nautilus Service result response
   */
  ambigHelper: function(result) {
    this.feedback = result.FEEDBACK;     
    var ambigoptions = '';
    $('#ul_disambigOptions li').each(function(){
      ambigoptions += $(this).text() + ' | ';
    });
    
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Ambig',                          // This needs to be event dependent
      'UV.EventTrigger': 'AmbigWindowOpen',             // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                  // Raw Nautilus parse tree
      'UV.NLPVote': '',                                 // Up or Down
      'UV.NLPUserQuery': this.getUserQuery(),           // Query by User
      'UV.NLPFeedback': '',                             // Specific feedback by user
      'UV.NLPParseQuery': this.feedback,                // NLP understood text
      'UV.AmbigOptions': ambigoptions,
      'UV.AmbigSelection': ''
    };

    var capturePrevSearchID = capture.getSearchQueryParams();
    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }

    return capture.sendCaptureRequest(eventInfo, 'AmbigWindowOpen', true); 
  },    
  
  /**
   * Update filter attributes in case of successful NLP response
   * @param {Object} result - Semantha's Nautilus Service result response
   */
  handleFilterAttributes: function(result) {
    this.feedback = result.FEEDBACK;
    if (result.HOTELID != undefined) { //hotel exact match
      nlpHotelIds = [result.HOTELID];
      isQueryExactHotelSearch = true;
      zoom = 15;
      updateAmenityLabel(); 

      if (result.HOTEL != undefined) {
        detailsOfExactMatchHotel.HOTEL = result.HOTEL;              
      }
      
      if (result.CENTER != undefined) {
        detailsOfExactMatchHotel.CENTER = result.CENTER;
      }       
    } 
    else { // only apply star rating/themes/brand when NOT exact hotel match
      //Set star rating
      if (result.HOTEL_STAR_RATING != undefined) {
        nlpStar = nlpStarMin = nlpStarMax = result.HOTEL_STAR_RATING;
        addNewStarRatingListFilterGivenRating(nlpStar);
      }
      
      //Set brand string
      if (result.HOTEL_BRAND != undefined) {

        nlpbrand = lodash.startCase(result.HOTEL_BRAND[0]);
        nlpBrandIds.push(result.HOTEL_BRAND_ID[0]);
        this.feedback = this.feedback + ' Hotel Brand Match ' + nlpbrand;
        regionhotelbrandlabel = ' | Brands: ' + nlpbrand;
      }
      
      //Set hotel attributes of theme and amenities
      if (result.HOTEL_ATTRIBUTE != undefined) {

        this.feedback = this.feedback + ' Amenities: ';

        if (nlpAmenityIds == null) {
          nlpAmenityIds = [];
        }

        for (var n = 0; n < result.HOTEL_ATTRIBUTE_ID.length; n++) {

          var amenityId = result.HOTEL_ATTRIBUTE_ID[n];

          if (!_.isEmpty(amenityId)) {

            nlpAmenityIds.push(amenityId);

            if (getAffinityCategory(amenityId) === 'Theme') {                     
              if (isExtraFilter(amenityId)) {
                addExtraFilter('div_themesList',amenityId);
              }
              else {
                selectAmenityFilter(amenityId);
              }
            }
            else {                     
              if(isExtraFilter(amenityId)){                         
                addExtraFilter('div_amenitiesList',amenityId);
              }
              else {
                selectAmenityFilter(amenityId);
              }
            }
          } 
        }         
      }
      //Update the amenity labels
      updateAmenityLabel();
    }
        
    return 'filterAttributesUpdated';
  },
  
  /**
   * Returns an attribute string (ex. "+ Pool & Beach & 4 star") to be shown in disambig dialog
   *
   * @param {Object} result
   * @returns {String} Attribute string
   */
  getAttributeString: function (result) {
    //Set star rating
    var starRating = '',
        amenities = '';

    if (typeof(result.HOTEL_STAR_RATING) !== 'undefined') {     
      starRating = result.HOTEL_STAR_RATING.substring(0,1) + ' stars';
    }
  
    if (typeof(result.HOTEL_ATTRIBUTE) !== 'undefined') {
      for (var n = 0; n < result.HOTEL_ATTRIBUTE.length; n++) {
        if (!_.isEmpty(amenities)) {
          if (!_.isEmpty(result.HOTEL_ATTRIBUTE)) {
            amenities = ' + ' + result.HOTEL_ATTRIBUTE[n].capitalize();
          }
        }
        else if (!_.isEmpty(result.HOTEL_ATTRIBUTE)) {
          amenities = amenities + ' & ' + result.HOTEL_ATTRIBUTE[n].capitalize();
        }
      }         
    }
  
    if (_.isEmpty(starRating) && _.isEmpty(amenities)) {
      return '';
    } else if (_.isEmpty(starRating) && !_.isEmpty(amenities)) { //amenities with no star rating
      return amenities;
    } else if (!_.isEmpty(starRating) && _.isEmpty(amenities)) { //star rating no amenities
      return ' + ' + starRating;
    } else { //both exist
      return amenities + ' & ' + starRating;
    }
  },
  
  /**
   * Remove clicked brand tag and update the filter brand string to be sent to dmap and show new result
   * @returns {String} 'brandRemoved'
   */
  removeBrandFilter: function(e) {
    e = e ? e : window.event;
    var brandNameToBeRemoved;
    if($(e.target).hasClass('clickableTag')) {
      brandNameToBeRemoved = $(e.target).attr('tagData');
      $(e.target).remove();
    }
    else if($(e.target).hasClass('clickableTagCloseIcon')) {
      brandNameToBeRemoved = $(e.target).parent().attr('tagData');
      $(e.target).parent().remove();
    }     
    
    //if brandNameToBeRemoved is not undefined
    if(brandNameToBeRemoved !== undefined ) {
      brandNameToBeRemoved = brandNameToBeRemoved.substring(0,brandNameToBeRemoved.length);
    }
    //update nlpbrand variable 
    nlpbrand = this.removeValueFromString(nlpbrand,brandNameToBeRemoved);
    //Clear map items
    itemsvcHotel.clearItems();
    //clear hotels from the previous response
    Hotels = [];
    App.nautilusHotels = [];
    //Update the hotel request to DMAP
    updateHotelRequest();
    //make DMAP requests
    itemsvcHotel.makeRequests();
    itemsvcHotel.clearItemsRequests();
    
    return 'brandRemoved';
  },
  
  /**
   * Remove a value from a string/list based on a given separator
   *
   * @param {string} list - string to search, split on separator
   * @param {string} value - value to remove
   * @param {string} [separator = ','] - string to split the list with String.prototype.split, default to ','
   */
  removeValueFromString: function(list, value, separator) {
    separator = separator || ',';
    var values = list.split(separator);

    for(var i = 0 ; i < values.length ; i++) {
      if(values[i] === value) {
        values.splice(i, 1);
        return values.join(separator);
      }
    }
    return list;
  },
  
  /**
   * Display voting popup (thumbs up/down)
   */
  putVotingPop: function () {
    var content = '<span id="none_thumbup" class="thumbup thumbgreen"></span><span id="none_thumbdown" class="thumbdown thumbred"></span>' + getLocalizedString('feedback.start');
    $('#div_filterBarOuterContainer').qtip({
      prerender: true,
      content: {
        text: '', 
        title: content,
        button: $('<span class="customCloseIcon"></span>')
      },
      position: {
        my: 'top left',
        at: 'bottom left',
        target: $('#div_filterBarOuterContainer'),
        adjust: { x: 16, y: -2}
      },
      show: {
        event: 'this.click',
        ready: true,
        effect: function() {
            $(this).fadeTo(500, 1);
        }
      },
      hide: {
        fixed: true,
        event: 'this.click',
        target: $('.thumbup','.thumbdown')          
      },
      style: {
        classes: 'qtip-dark',
        tip: { 
          corner: 'top left',
          mimic: 'top right',
          border: 1,
          width: 8,
          height: 8
        }
      }
    });
  },
  
  /**
   * Show thumb up feedback, send info to capture
   */
  showUpFeedback: function () {
    this.vote = 'Up';
    var content = '<span id="up_thumbup" class="thumbup thumbgreen"></span><span id="up_thumbdown" class="thumbdown thumbblack"></span>' + getLocalizedString('feedback.up');
    $('#div_filterBarOuterContainer').qtip({
      prerender: true,
      content: {
        text: '<textarea id="ip_feedback" class="jq_watermark" spellcheck="false" placeholder=\"' + getLocalizedString('feedback.up.watermark') + '\"></textarea><div id="div_sendVoteButtonOuter" class="roundEdgeForIE9 sendVoteButtonOuter"><a class="blueButton sendFeedbackButton" id="lnk_sendVote">Send</a></div>',  
        title: content,
        button: $('<span class="customCloseIcon"></span>')
      },
      position: {
        my: 'top left',
        at: 'bottom left',
        target: $('#div_filterBarOuterContainer'),
        adjust: { x: 16, y: -2}
      },
      show: {
        event: 'this.click',
        ready: true
      },
      hide: {
        fixed: true,
        event: 'this.click',
        target: $('#sendVote')
      },
      style: {
        classes: 'qtip-dark',
        tip: { 
          corner: 'top left',
          mimic: 'top right',
          border: 1,
          width: 8,
          height: 8
        }
      }
    }); 
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Vote',                         // This needs to be event dependent
      'UV.EventTrigger': 'ThumbsIconClicked',         // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                // Raw Nautilus Data
      'UV.NLPVote': this.vote,                        // Up or Down
      'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
      'UV.NLPFeedback': $('#ip_feedback').val(),      // Specific feedback by user
      'UV.NLPParseQuery': this.feedback               // NLP understood text
    };

    var capturePrevSearchID = capture.getSearchQueryParams();

    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
  
    //Send capture request
    return capture.sendCaptureRequest(eventInfo, 'ThumbsIconClicked', true); 
  },
  
  /**
   * Show thumb down feedback, send info to capture
   */
  showDownFeedback: function () {
    this.vote = 'Down';
    var content = '<span id="down_thumbup" class="thumbup thumbblack"></span><span id="down_thumbdown" class="thumbdown thumbred"></span>' + getLocalizedString('feedback.down');
    $('#div_filterBarOuterContainer').qtip({
      prerender: true,
      content: {
        text: '<textarea id="ip_feedback" class="jq_watermark" spellcheck="false" placeholder=\"' + getLocalizedString('feedback.down.watermark') + '\"></textarea><div id="div_sendVoteButtonOuter" class="roundEdgeForIE9 sendVoteButtonOuter"><a class="blueButton sendFeedbackButton" id="lnk_sendVote">Send</a></div>',  
        title: content,
        button: $('<span class="customCloseIcon"></span>')
      },
      position: {
        my: 'top left',
        at: 'bottom left',
        target: $('#div_filterBarOuterContainer'),
        adjust: { x: 16, y: -2}
      },
      show: {
        event: 'this.click',
        ready: true
      },
      hide: {
        fixed: true,
        event: 'this.click',
        target: $('#sendVote')
      },
      style: {
        classes: 'qtip-dark',
        tip: { 
          corner: 'top left',
          mimic: 'top right',
          border: 1,
          width: 8,
          height: 8
        }
      }
    });
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Vote',                         // This needs to be event dependent
      'UV.EventTrigger': 'ThumbsIconClicked',         // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                // Raw Nautilus parse tree
      'UV.NLPVote': this.vote,                        // Up or Down
      'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
      'UV.NLPFeedback': $('#ip_feedback').val(),      // Specific feedback by user
      'UV.NLPParseQuery': this.feedback               // NLP understood text
    };

    var capturePrevSearchID = capture.getSearchQueryParams();

    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
  
    //Send capture request
     return capture.sendCaptureRequest(eventInfo, 'ThumbsIconClicked', true);  
  },
  
  /**
   * Send detail feedback, send info to capture
   */
  sendFeedback: function () { 
    var tempCaptureResponse = '';

    if ($('#ip_feedback').val() !== '') {
      
      //Define variables related to event
      var eventInfo = {
        'UV.EventType': 'Vote',                         // This needs to be event dependent
        'UV.EventTrigger': 'DetailFeedbackSend',        // This needs to be dynamic as per the event
        'UV.NLPParseTree': nautilusData,                // Raw Nautilus parse tree
        'UV.NLPVote': this.vote,                        // Up or Down
        'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
        'UV.NLPFeedback': $('#ip_feedback').val(),      // Specific feedback by user
        'UV.NLPParseQuery': this.feedback               // NLP understood text
      };

      var capturePrevSearchID = capture.getSearchQueryParams();

      if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
        eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
        eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
      }

      //Send capture request
      tempCaptureResponse = capture.sendCaptureRequest(eventInfo, 'DetailFeedbackSend', true); 
    }

    $('#div_filterBarOuterContainer').qtip({
      prerender: true,
      content: {
        text: '', 
        title: '<div class="finalFeedback">' + getLocalizedString('feedback.final') + '</div>'
      },
      position: {
        my: 'top left',
        at: 'bottom left',
        target: $('#div_filterBarOuterContainer'),
        adjust: { x: 16, y: -2}
      },
      show: {
        event: 'this.click',
        ready: true
      },
      hide: {
        fixed: true,
        event: false,
        inactive: 2000,
        effect: function() {
          $(this).fadeTo(500, 0);
        },
        target: $('.finalFeedback')
      },
      style: {
        classes: 'qtip-dark',
        tip: { 
          corner: 'top left',
          mimic: 'top right',
          border: 1,
          width: 8,
          height: 8
        }
      }
    });

    return tempCaptureResponse;
  },  
  
  /**
   * Show ambig thumbup feedback, send info to capture
   */
  showAmbigUpFeedback: function () {  
    $('#div_ambigFeedback').hide();
    $('#div_ambigDown').hide();
    $('#div_ambigUp').show();
    $('#div_ambigFinal').hide();
    document.getElementById('ip_ambigfeedbackup').value = '';
    document.getElementById('ip_ambigfeedbackdown').value = '';
    this.vote = 'Up';
    var ambigoptions = '';
    $('#ul_disambigOptions li').each(function(){
      ambigoptions += $(this).text() + ' | ';
    });
    
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Ambig',                        // This needs to be event dependent
      'UV.EventTrigger': 'AmbigThumbsIconClicked',    // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                // Raw Nautilus parse tree
      'UV.NLPVote': this.vote,                        // Up or Down
      'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
      'UV.NLPFeedback': '',                           // Specific feedback by user
      'UV.NLPParseQuery': this.feedback,              // NLP understood text
      'UV.AmbigOptions': ambigoptions,                // Ambig options selected
      'UV.AmbigSelection': ''
    };

    var capturePrevSearchID = capture.getSearchQueryParams();
    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
  
    //Send capture request
    return capture.sendCaptureRequest(eventInfo, 'AmbigThumbsIconClicked', true);  
  },
  
  /**
   * Show ambig thumbdown feedback. send info to capture
   */
  showAmbigDownFeedback: function () {  
    $('#div_ambigFeedback').hide();
    $('#div_ambigUp').hide();
    $('#div_ambigDown').show();
    $('#div_ambigFinal').hide();
    document.getElementById('ip_ambigfeedbackup').value = '';
    document.getElementById('ip_ambigfeedbackdown').value = '';
    this.vote = 'Down';
    var ambigoptions = '';
    $('#ul_disambigOptions li').each(function(){
      ambigoptions += $(this).text() + ' | ';
    });
    
    //Define variables related to event
    var eventInfo = {
      'UV.EventType': 'Ambig',                        // This needs to be event dependent
      'UV.EventTrigger': 'AmbigThumbsIconClicked',    // This needs to be dynamic as per the event
      'UV.NLPParseTree': nautilusData,                // Raw Nautilus parse tree
      'UV.NLPVote': this.vote,                        // Up or Down
      'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
      'UV.NLPFeedback': '',                           // Specific feedback by user
      'UV.NLPParseQuery': this.feedback,              // NLP understood text
      'UV.AmbigOptions': ambigoptions,
      'UV.AmbigSelection': ''
    };

    var capturePrevSearchID = capture.getSearchQueryParams();
    if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
      eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
      eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
    }
  
    //Send capture request
    return capture.sendCaptureRequest(eventInfo, 'AmbigThumbsIconClicked', true);  
  },

  /**
   * Show ambig detail feedback, send info to capture
   */
  showAmbigFinalFeedback: function () { 
      $('#div_ambigFeedback').hide();
      $('#div_ambigUp').hide();
      $('#div_ambigDown').hide();
      $('#div_ambigFinal').show();
      var ambigoptions = '';
      $('#ul_disambigOptions li').each(function(){
        ambigoptions += $(this).text() + ' | ';
      });
    
      var userfeedback = '';
      if ($('#ip_ambigfeedbackup').val() !== '')
      {
        userfeedback = $('#ip_ambigfeedbackup').val();
      }
      if ($('#ip_ambigfeedbackdown').val() !== '')
      {
        userfeedback = $('#ip_ambigfeedbackdown').val();
      }
      if (userfeedback !== '') {
        
      //Define variables related to event
      var eventInfo = {
        'UV.EventType': 'Ambig',                        // This needs to be event dependent
        'UV.EventTrigger': 'AmbigDetailFeedbackSend',   // This needs to be dynamic as per the event
        'UV.NLPParseTree': nautilusData,                // Raw Nautilus parse tree
        'UV.NLPVote': this.vote,                        // Up or Down
        'UV.NLPUserQuery': this.getUserQuery(),         // Query by User
        'UV.NLPFeedback': userfeedback,                 // Specific feedback by user
        'UV.NLPParseQuery': this.feedback,              // NLP understood text
        'UV.AmbigOptions': ambigoptions,
        'UV.AmbigSelection': ''
      };

      var capturePrevSearchID = capture.getSearchQueryParams();
      if( capturePrevSearchID.hasOwnProperty('SearchQueryId') && capturePrevSearchID.hasOwnProperty('BrowserGUID')) {
        eventInfo['UV.SearchQueryId'] = capturePrevSearchID.SearchQueryId;
        eventInfo['UV.BrowserGUID'] =  capturePrevSearchID.BrowserGUID;
      }
    
      //Send capture request
       return capture.sendCaptureRequest(eventInfo, 'AmbigDetailFeedbackSend', true); 
      } 
  },

  /**
   * Set the Nautilus version text in parse tree window
   */
  setNautilusVersion: function () {
    App.Services.Nautilus.getVersion(function (err, result) {
      if (err || result === undefined) {
        document.getElementById('spn_nautilusVersion').innerHTML = 'Unable to get version';
      }
      else {
        document.getElementById('spn_nautilusVersion').innerHTML = result;
      }
    });
  },

  /**
   * Get the search query, uses jQuery
   * @returns {string}
   */
  getUserQuery: function () {
    return $('#ip_travelRequest').val();
  }

});
