'use strict';

var itemsvcHotel,
    nlpStar = 0,
    nlpbrand = '',
    nlpAmenityIds = [],
    nlpBrandIds = [],
    nlpAmenities = [],
    nlpPrice = {},
    nautilusData,
    hoverBox,
    zoom,
    previoustag,
    oldzindex = 0,
    Hotels = createArray(1, 8),
    map,
    nlpStarMin,
    nlpStarMax,
    roomFilter = '',
    isHotelDetail,
    msInADay = 1000*60*60*24,
    isCtrl = false,
    isAlt = false,
    doNotClearMapMarkers = false,
    priceMarkerNum = 10,
    nlpSortOrder = 'EXPEDIA_PICKS',
    nlpHotelName = '',
    nlpHotelIds = [],
    regionhotelbrandlabel = '',
    isStreetView = false,
    autoCompleteSelected = false,
    addressPrefix = 'address:',
    addressZoomLevel = 14,
    aggrZoomLevel = 11,
    mapViewChangedCount = 0,
    zoomExplicitily = false,
    eventTriggerer,
    typeOfSearch,
    isSearchInProgress = false,
    responseCount = 10,//The response count is defaulted to something non-zero to avoid sending a capture request unless reset to 0
    keycode = '',
    e,
    serverPrefix='/',
    myData = [],
    oldvalue = '',
    oldQuery = '',
    gemmaServerData = null,
    lcmAffinityMappingData = null,
    first,
    triggerByItem = 0,
    createTravelRequestHandler = null,
    MEDIA_PATH = 'https://images.travelnow.com/hotels',
    gemmaVersionHandler = null,
    isQueryExactHotelSearch = false,
    renderHotelHandler = null,
    addHotelToListHandler = null,
    exactAddressContent = null,
    captureServerData = null,
    poiContent = [],
    detailsOfExactMatchHotel = {},
		locationTagLength = 40,
		brandNameTagLength = 20,
    eventMatchers = {
		  'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
		  'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    },
    defaultOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
		},
		usaPolygon = [
			{
				"lat": 26.928115,
				"lng": -179.885422
			},
			{
				"lat": 18.981648,
				"lng": -155.600412
			},
			{
				"lat": 24.535743,
				"lng": -81.698672
			},
			{
				"lat": 24.675025,
				"lng": -81.109809
			},
			{
				"lat": 24.789417,
				"lng": -80.79954
			},
			{
				"lat": 24.830801,
				"lng": -80.736196
			},
			{
				"lat": 24.988379,
				"lng": -80.510418
			},
			{
				"lat": 25.170199,
				"lng": -80.332268
			},
			{
				"lat": 44.81624,
				"lng": -66.977104
			},
			{
				"lat": 44.921773,
				"lng": -66.975655
			},
			{
				"lat": 46.888597,
				"lng": -67.940022
			},
			{
				"lat": 47.3548,
				"lng": -68.288896
			},
			{
				"lat": 69.97326,
				"lng": -140.79869
			},
			{
				"lat": 71.344714,
				"lng": -156.624813
			},
			{
				"lat": 71.344714,
				"lng": -156.850366
			},
			{
				"lat": 70.65349,
				"lng": -160.063219
			},
			{
				"lat": 68.901882,
				"lng": -166.294764
			},
			{
				"lat": 68.4158,
				"lng": -166.861919
			},
			{
				"lat": 63.788399,
				"lng": -171.746611
			},
			{
				"lat": 52.013279,
				"lng": -177.007466
			}
			];


function getRoomFilterJSON() {
	//rooms:[{AdultCount:2,ChildAges:[5,12]}, {AdultCount:1}]
	var sb=new StringBuilder();
	sb.append('[');

	$('#fld_roomsGuests .roomItem.clearfix').each(function(i){
		sb.append('{');
		var adultsCount = $(this).find('.adultsCount').val();
		sb.append('"AdultCount":' + adultsCount);
		var childrenCount = $(this).find('.children').find('select').val();
		if(childrenCount<=0){
			sb.append('},');
		}
		else
		{
			sb.append(",\"ChildAges\":[");

			$(this).find(".childAge.clearfix").find("select").each(function(j,obj){
				if($(obj).attr("disabled")!="disabled")
				{
					var childAge = $(obj).val();
					sb.append(childAge+",");
				}
			});
			sb.append("]},");
		}

	});
	sb.append("]");
	return sb.toString().replace(/,]/g,"]");
}

function constructRoomFilter() {
    roomFilter=getRoomFilterJSON();

    if($('#div_mapContainer').length>0){
        renderHotel(true);
    }

    //TODO:sendCaptureRequest('RoomGuestsUpdate','RoomGuestsUpdateSearch', true);
}

function hoteldetailsURL(id, prefix) {
	var url = prefix,
	    hotelId = id,
	    arrivalDate = $("#ip_dpfrom").val(),
      departureDate = $("#ip_dpto").val(),
      tags = '&tags=',
      regex = new RegExp("&", 'g');

	if (arrivalDate == null || arrivalDate == getLocalizedDatePickerDefaultStartDate()) {
    arrivalDate = '';
  }
	if (departureDate == null || departureDate == getLocalizedDatePickerDefaultEndDate()) {
    departureDate = '';
  }
  if (nlpAmenityIds == null) {
    nlpAmenityIds = [];
  }

	tags = tags +  nlpAmenityIds.join();
	url = url + "hotelId=" + hotelId + "&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + tags + "&query=" + $('#ip_travelRequest').val().replace(regex,'%26');
	url = capture.addCaptureInfo(url);

	var roomdetails = getRoomDetails();

	if (roomdetails == undefined) {
		return null;
	}

	return url + "&roomdetails=" + roomdetails;
}

function hoteldetails(id) {
	var url = hoteldetailsURL(id, '/semantha/hoteldetails?');

	if (url != null) {
		window.open(url);
	}

}

function createArray(length) {
	var a = new Array(length || 0);

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < length; i++) {
			a[i] = createArray.apply(this, args);
		}
	}
	return a;
}

function simulate(element, eventName) {
	var options = extend(defaultOptions, arguments[2] || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents') {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else {
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
					options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
					options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		if(element!=null){
			element.dispatchEvent(oEvent);
		}

	}
	else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		if(element!=null){
			element.fireEvent('on' + eventName, oEvent);
		}

	}
	return element;
}

function extend(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
}

// Initialize the map
function initMap() {
	var lat = getAndRemoveSessionStorageKey('mapCenterLat'),
	    lng = getAndRemoveSessionStorageKey('mapCenterLng'),
	    zoom = getAndRemoveSessionStorageKey('mapZoom');

	if ( lat == undefined || lng == undefined ) {
		lat = 20.52382711348452;
		lng = -4.220000000000027 ;
	}

	if (zoom == undefined) {
		if (getURLParameter('query') != undefined ) {
			zoom = 14;
		}
    else {
			zoom = 3;
		}
	}
    // Enable the visual refresh
	google.maps.visualRefresh = true;

	map = new expedia.dmap.google.Map(document.getElementById('div_mapContainer'), {
		zoom: zoom,
		center: new expedia.dmap.LatLong( lat, lng ),
    streetViewControl:true,
    streetViewControlOptions: {
      position:google.maps.ControlPosition.LEFT_CENTER
    },
		panControl:false,
    panControlOptions: {
      position:google.maps.ControlPosition.LEFT_CENTER
    },
		zoomMax:19,
		zoomMin:3,
		zoomControlOptions: {      
			style:google.maps.ZoomControlStyle.AUTO,
			position:google.maps.ControlPosition.LEFT_CENTER
    },
		styles: customMapStyles
	});

	var thePanorama = map.getMapProvider().getStreetView();

	google.maps.event.addListener(thePanorama, 'visible_changed', function() {
    if (thePanorama.getVisible()) {
      isStreetView = true;
      $("div.tiptip_holder").css("display","none");
    }
    else {
      isStreetView = false;
    }
	});

	Hotels.length = 0;
  App.nautilusHotels = [];

	map.events.addEventListener('idle', function () {
    App.searchView.hideDetailsPane();
    updateHotelRequest();
	});

	map.events.addEventListener(expedia.dmap.Map.EVENT_CLICK, function () {
		deactive_tiptip();

		if (previoustag == undefined) {
      App.searchView.hideDetailsPane();
            
      if(!($.browser.msie && $.browser.version<=8)) {
        if($(window).width()<=767) {
          $('.row-offcanvas').removeClass("active");
        }
      }
		}
	});

	map.events.addEventListener(expedia.dmap.Map.EVENT_DOUBLE_CLICK, function() {
    App.searchView.hideDetailsPane();

    if(!($.browser.msie && $.browser.version<=8)) {
      if($(window).width()<=767) {
        $('.row-offcanvas').removeClass("active");
      }
    }
	});

	map.events.addEventListener(expedia.dmap.Map.EVENT_DOUBLE_CLICK, deactive_tiptip);

	map.events.addEventListener(expedia.dmap.Map.EVENT_CENTER_CHANGED, function(){
		updateMapConfig();
    App.searchView.hideDetailsPane();
		
		deactive_tiptip();
		Hotels.length = 0;
    App.nautilusHotels = [];

		if (mapViewChangedCount > 1){
			isQueryExactHotelSearch = false;
		}

		mapViewChangedCount++;
	});

	map.events.addEventListener(expedia.dmap.Map.EVENT_ZOOM_CHANGED, function () {
		if (hoverBox) {
			hoverBox.setOptions({content: ''});
		}

		itemsvcHotel.clearItems();
		Hotels.length = 0;
    App.nautilusHotels = [];
		updateMapConfig();
		updateHotelRequest();
    App.searchView.hideDetailsPane();

		if((mapViewChangedCount > 1 && zoomExplicitily == false) ||
				(mapViewChangedCount > 2 && zoomExplicitily == true)){
			isQueryExactHotelSearch = false;
		}
		mapViewChangedCount++;
	});

	itemsvcHotel = new ItemService(map, { removeItemsNotVisible: true });

	// request all the available information for hotels
	itemsvcHotel.addItemDataRequest({
		'Address':true,
		'Bounds':true,
		'Image':true,
		'Price':true,
		'Star':true,
		'EanId':true,
		'Size':true
	});

	itemsvcHotel.events.addEventListener("responseprocessed", function(){

		if(eventTriggerer == "SearchBoxEnter" || eventTriggerer== "SearchBoxIconClick" || eventTriggerer == "SearchBoxSuggestionClick" || eventTriggerer == "SearchBoxSuggestionSelectThenEnter" ) {
			//Only in these cases is the search related to a query. Hence we need a unique search ID
			App.searchView.addNewSearchEventCaptureInfo(typeOfSearch, eventTriggerer, "Search");
		}
		else {
			//In this case the search should be tied to any previous text search
			App.searchView.addSubsequentSearchEventCaptureInfo(typeOfSearch, eventTriggerer, "Search");
		}
	});

	hoverBox = getHoverBox();
	updateMapConfig();

	if(sessionStorage.getItem("userPrefsExist") == undefined && getURLParameter('query')== undefined) {
		centerToUS();
	}
	else{
		renderHotel( true );
	}
}

function getHoverBox() {
	return new Content(map, null, {
		style: {whiteSpace:'nowrap'},
		content:''
	});
}

function init() {
	$('#div_resultsListContainer').css('display','block');
    //Adjusting width of map container in IE 8
    if($.browser.msie && $.browser.version == 8) {
        $('#div_mapContainer').width($('#div_mapAndListContainer').width() - 312);
    }

    //Set the height of the map and list container
    $('#div_mapAndListContainer').css("height",$(window).height() - $('#div_headerContainer').outerHeight() - $('#div_filterBarOuterContainer').outerHeight());
    //Set the height if the map container
    $('#div_mapContainer').css("height", $('#div_mapAndListContainer').outerHeight());
   
	initMap();
}

function setUserPrefs() {
	/*
	 *	The following user prefs are set here:
	 *	1. Search query string
	 *	2. Star rating filter selection
	 *	3. Sort filter selection
	 *	4. Hotel refine filter string
	 *
	 * The 'Amenities' and the 'Themes' filter preferences are set in the
	 * success callback function of the call to get LcmAmenitiesIdMappings.
	 * (See getLcmAmenityIdMappings()).
	 *
	 * The 'Price' filter selection is set in the success callback function
	 * of the call to get the price range. (See getPriceRange()).
	 *
	 * The 'Room details' info is initialized in the selectroom.js file.
	 *
	 * The 'Check In' and 'Check Out' dates are initialized in the
	 * holtelfinder.js file.
	 *
	 * The map's zoom, center's lat and lng are set in the initMap() method.
	 */

	var searchQuery = getAndRemoveSessionStorageKey( "searchQuery" );
	if ( searchQuery != undefined ) {
		$('#ip_travelRequest').val( searchQuery );
	}

	var hotelNameFilter = getAndRemoveSessionStorageKey( "refineByHotelFilter" );
	if ( hotelNameFilter != undefined ) {
		var hotelRefine = $('#ip_hotelRefine');
		hotelRefine.val( hotelNameFilter );
		hotelRefine.keyup();
	}
	
	setUserPrefStarRating();
	setUserPrefSingleSelect( $('#div_sortList ul'), "selectedSortFilterIndex" );
}

function setUserPrefStarRating() {

	var selectedStarRatingId = getAndRemoveSessionStorageKey( "selectedStarRatingIndex" );
	var starRatingListElement = $( '#ul_starRating' );
	
	if ( selectedStarRatingId != undefined ) {
		var selected = starRatingListElement.find( '#' + selectedStarRatingId );
		if ( selected.length <= 0 ) {
			// This is a dynamic filter. It needs to be created before it can be clicked.
			addStarRatingListFilterGivenId( selectedStarRatingId );
		}
	}
	
	setSingleSelect( starRatingListElement, selectedStarRatingId );
}

/**
 * This function is meant for single select filter list elements that
 * do not support dynamic filters.
 */
function setUserPrefSingleSelect(singleSelectListElement, sessionStorageKey) {

	var selectedId = getAndRemoveSessionStorageKey( sessionStorageKey );
	
	if ( singleSelectListElement != undefined ) {
		setSingleSelect( singleSelectListElement, selectedId );
	}
}

function setSingleSelect(singleSelectListElement, selectedId) {
	
	if ( selectedId != undefined ) {
		var selected = singleSelectListElement.find( '#' + selectedId );
		if ( selected.length > 0 ) {
			selected.click();
		}
	}
	else {
		// If no user preference has been specified,
		// select the first list element as that is the default.
		var firstChild = singleSelectListElement.children('li').get(0);
		$(firstChild).addClass('pageLoadSingleSelect');
		if(firstChild != undefined){
			firstChild.click();		
		}
	}
}

function setUserPrefsMultiSelect(containerId, sessionStorageKey) {

	var value = getAndRemoveSessionStorageKey( sessionStorageKey );

	if ( value != undefined ) {
		var ids = value.split( ',' );

		for (var i = 0; i < ids.length; i++) {
			var arr = ids[i].split( '#' );
			
			if ( arr.length == 1 ) {
				var element = $( '#' + containerId ).find( '#' + arr[0] );
				if ( element.length > 0 ) {
					element.click();
				}
			}
			else if ( arr.length == 2 ) {
				// Add the extra filter
				addExtraFilter( containerId, arr[0], arr[1] );
				
				var element = $( '#' + containerId ).find( '#' + arr[0] );
				if ( element.length > 0 ) {
					element.removeClass( 'on' );
					element.click();
				}
			}
		}
	}
}

$(document).ready(function () {	
	App.start();
	onPageReady();

	$('#div_mapContainer').bind('click', function () {
		//closeInfoWindow();
		$("#ip_travelRequest").autocomplete('close');
	});
	$(".ui-widget-header").hide();
	//allow show close button
	$(".ui-widget-content").css("overflow", "visible");
	//map height no scoller bar
	if($('#div_mapContainer').length>0){
		init();
	}
	
  //Set the height of the map and list container
  $('#div_mapAndListContainer').css("height",$(window).height() - $('#div_headerContainer').outerHeight() - $('#div_filterBarOuterContainer').outerHeight());
  //Set the height if the map container
  $('#div_mapContainer').css("height", $('#div_mapAndListContainer').outerHeight());

  //Adjustments for IE 8
  if($.browser.msie && $.browser.version == 8) {
      $('#div_mapAndListContainer').css('overflow','hidden');
  }

	$('.mapcontainer').css('overflow','hidden');

	$(".searchsItem").live("mouseover", function () {
		if((mobileDetect.mobile() !== null) || isStreetView) {
			return false;
		}
		var selectedElementId = $(this).attr('id').match(/\d+/g);
		var selectedMarker = document.getElementById(selectedElementId);
		
		if(selectedElementId == null) {
			simulate(document.getElementById($(this).attr('id').substring(1)), "mouseover");
		}
		else {
			simulate(selectedMarker, "mouseover");
		}

		//Set the target class to normal based on availability
		if($("#" + selectedElementId).hasClass("hotel_available_high"))
			$("#" + selectedElementId).attr("class", "hotel_available_high");
		
		if($("#" + selectedElementId).hasClass("hotel_available_medium"))
			$("#" + selectedElementId).attr("class", "hotel_available_medium");
		
		if($("#" + selectedElementId).hasClass("hotel_available_low"))
			$("#" + selectedElementId).attr("class", "hotel_available_low");



	});
	$(".searchsItem").live("mouseout", function () {
		if((mobileDetect.mobile() !== null) || isStreetView) {
			return false;
		}
		var selectedElementId = $(this).attr('id').match(/\d+/g);
		var selectedMarker = document.getElementById(selectedElementId);
		triggerByItem = 0;
		if(selectedElementId == null) {
			simulate(document.getElementById($(this).attr('id').substring(1)), "mouseout");
		}
		else {
			simulate(selectedMarker, "mouseout");
		}
		
		//Set target class to normal based on availability
		if($("#" + selectedElementId).length>0) {
			if ($("#" + selectedElementId).hasClass("hotel_available_high")) {
				$("#" + selectedElementId).attr("class", "hotel_available_high");
			}
			else if ($("#" + selectedElementId).hasClass("hotel_available_medium")) {
				$("#" + selectedElementId).attr("class", "hotel_available_medium");
			}
			else if ($("#" + selectedElementId).hasClass("hotel_available_low")) {
				$("#" + selectedElementId).attr("class", "hotel_available_low");
			}
						
		}
		
		//Set the target class to normal based on click bubble
		if (($("#" + selectedElementId).attr("class")!=null && $("#" + selectedElementId).attr("class").indexOf("priceMarker") >= 0) && ($("#" + selectedElementId).attr("clickbubble") != '1'))
		{
			$("#" + selectedElementId).attr("class", "priceMarker");
		}
			
		if (($("#" + selectedElementId).attr("class")!=null && $("#" + selectedElementId).attr("class").indexOf("hotMarker") >= 0) && ($("#" + selectedElementId).attr("clickbubble") != '1'))
		{
			$("#" + selectedElementId).attr("class", "hotMarker");
		}
			
		if (($("#" + selectedElementId).attr("class")!=null && $("#" + selectedElementId).attr("class").indexOf("hotUnavailableMarker") >= 0) && ($("#" + selectedElementId).attr("clickbubble") != '1'))
		{
			$("#" + selectedElementId).attr("class", "hotUnavailableMarker");
		}
		
		if ($("#" + selectedElementId).attr("clickbubble") != '1') {
			$(this).removeClass("resultItemSelected");
		}
	});

	$(".searchsItem").live("click", function () {
		if(isStreetView)
		{
			return false;
		}
		var selectedElementId = $(this).attr('id').match(/\d+/g);
		var selectedMarker = document.getElementById(selectedElementId);
		triggerByItem = 1;
		simulate(selectedMarker, "click");
		$(this).addClass("resultItemSelected");
	});

	$(".hover-btn").live("click", function (event) {
		event.stopPropagation();
		var selectedElementId = $(this).parent().parent().attr('id').match(/\d+/g);
		//console.log('hover click......' + selectedElementId);
		hoteldetails(selectedElementId);
	});
	
	$('.menuItem').click(function(){
		clearPopup();
	});

	$(document).keyup(function (e) {
		if(e.which == 17) isCtrl=false;
		if(e.which == 18) isAlt= false;

  }).keydown(function (e) {
		if(e.which == 17) isCtrl=true;
		if(e.which == 18) isAlt=true;
		if(e.which == 73 && isCtrl == true && isAlt == true) {
			//run code for CTRL+S -- ie, save!
			openParseWindow();
		}
	});

	setTravelRequestWidth();
	$("#ip_travelRequest").focus();
	setUserPrefs();

});

window.onload = function(){

	$('#ip_travelRequest').focus();

	var userPrefsExist = getAndRemoveSessionStorageKey( "userPrefsExist" );
	if ( userPrefsExist != undefined && window.map != undefined ) {
		renderHotel( true );
	}
};

$(window).resize(function () {
    
  //Set the height of the map and list container
  $('#div_mapAndListContainer').css("height",$(window).height() - $('#div_headerContainer').outerHeight() - $('#div_filterBarOuterContainer').outerHeight());
  //Set the height if the map container
  $('#div_mapContainer').css("height", $('#div_mapAndListContainer').outerHeight());

  if($('#div_detailsPaneContainer').css('display')=='block') {
      $('#div_detailsPaneContainer').css("height", $('#div_mapContainer').outerHeight());
      $('#div_detailsPane').css("height", $('#div_mapContainer').outerHeight());
      $('.details-pane').css("height", $('#div_mapContainer').outerHeight());
      $('.details-pane-content').css("height", $('#div_mapContainer').outerHeight()-$('.details-pane-nav').outerHeight());
  }
	setTravelRequestWidth();

	$("#div_parsePopup").dialog("option", "position", "center");

  //Adjustments for IE8
  if($.browser.msie && $.browser.version == 8) {
      $('#div_mapContainer').css('width',$('#div_headerContainer').width() - 450);
  }

});

//store the olde value of query input
function getOldValue() {
	oldvalue = $("#ip_travelRequest").val();
}

function getOldQuery() {
	if(oldQuery == ''){
		return $("#ip_travelRequest").val();
	}
  else {
		return oldQuery;
	}
}

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function () {
	}
});

function getPriceRange() {
	var currencyCode = getCurrencyCode();

	App.Services.PriceRange.getPriceRange(currencyCode, function (err, data) {

		if (err || data == undefined) {
			return;
		}

		$('#ul_priceList li:not(:first)').remove();

		for(var idx in data) {
			$('#ul_priceList').append('<li id="'+idx+'"><label>'+ data[idx] +'</label><span count="0">(0)</span></li>');
		}

		setUserPrefSingleSelect( $('#ul_priceList'), "selectedPriceFilterIndex" );
	});
}

function getGemmaServerData() {
	$.getJSON('gemmaServerData', function(data){
		gemmaServerData = data;
		if($('#div_parsePopup').length>0){
			getGemmaVersionProcess();
		}
	});
}

function getLcmAffinityMappings(){

	$.getJSON('lcmAffinityMappingData',function(data){
		lcmAffinityMappingData = data;
		setUserPrefsMultiSelect( "div_amenitiesList", "selectedAmenities" );
		setUserPrefsMultiSelect( "div_themesList", "selectedThemes" );
		updateAmenityLabel();
	});
}

function getPriceMarkerNum(){
	$.getJSON('priceMarkerNum',function(data){
		priceMarkerNum = data;
	});
}

function mailTo(mailTo){
	location.href = "mailto:" + mailTo;
}

function openParseWindow() {
  if (isSearchPage()) {
    App.searchView.setNautilusVersion();
    $("#div_parsePopup").dialog({
      modal: true,
      width: 800,
      height: 400,
      zIndex: 1002,
      resizable: false,
      autoOpen: true,
      title: 'Parse Tree',
      draggable: false,
      open: function () {
        $('.ui-widget-overlay').animate({opacity: 0.8}, 300);
        $('.ui-dialog-buttonpane').find('button:contains("Send")').addClass("btn-send");
        $('.ui-dialog-buttonpane').find('button:contains("Close")').addClass("btn-close");
        $('.ui-dialog-titlebar-close').removeClass('ui-dialog-titlebar-close').addClass('close-icon').unbind('hover');
        $('.ui-icon-closethick').hide();
        $('.ui-dialog-titlebar').css('height', $('.close-icon').css('height'));
        setTimeout(function () {
          $(document).unbind('mousedown.dialog-overlay')
            .unbind('mouseup.dialog-overlay');
        }, 200);
      },

      beforeClose: function (event, ui) {
        $('.ui-widget-overlay').animate({opacity: 0}, 300).hide(300);
        $(document).unbind($.ui.dialog.overlay.events);
      },
      show: {effect: "fade", duration: 300},
      hide: {effect: "fade", duration: 300}
    }).dialog('open');

    isCtrl = false;
    isAlt = false;
  }
}

function setupAC() {
  //setup auto complete control
	$("#ip_travelRequest").autocomplete({
		source: myData,
		dataType: "xml",
		open: function(event, ui) {  },
		select: function(event, ui) {
			autoCompleteSelected = true;
			createTravelRequest('Autosuggest', 'SearchBoxSuggestionClick'); }
	});

	var prefix = encodeURI($("#ip_travelRequest").val());

	if (oldvalue != prefix) {
		oldvalue = prefix;
	}
}

function createTravelRequest(searchType, eventTrigger) {

	if (!isSearchInProgress) {
		isSearchInProgress = true;

		if (createTravelRequestHandler != null) {
			clearTimeout(createTravelRequestHandler);
		}

    createTravelRequestHandler = setTimeout(function () {
      createTravelRequestHandle(searchType, eventTrigger);
    }, 500);
  }
}

function createTravelRequestHandle(searchType, eventTrigger) {

	isHotelDetail = false;
	clearAmentityFilter();
	nlpHotelIds = [];

  if (isSearchPage()) {
    App.searchView.removeAllItemsFromMap();
		App.listView.collection.reset();
  }

	eventTriggerer = eventTrigger;
	typeOfSearch = searchType;
	responseCount = 0;

	var dpFromDate = getURLParameter('arrivalDate'),
			dpToDate = getURLParameter('departureDate'),
			roomDetails = getURLParameter('roomdetails');

	if (window.location.href.indexOf('hoteldetail') > 0) {
		var regex = new RegExp("&", 'g'),
		    dest = "hotelfinder?query=" + $('#ip_travelRequest').val().replace(regex,'%26');

		if (!_.isEmpty(dpFromDate)){
			dest += '&arrivalDate=' + dpFromDate;
		}
		if (!_.isEmpty(dpToDate)) {
			dest += '&departureDate=' + dpToDate;
		}
		if (!_.isEmpty(roomDetails)) {
			dest += '&roomdetails=' + roomDetails;
		}

		window.location.href= dest;
	}

  // If IE8
  if($.browser.msie && $.browser.version <= 8) {
      $('body').css({'overflow-x':'auto','overflow-y':'hidden'});
  }
  else {
      $('body').css({'overflow-x':'hidden','overflow-y':'hidden'});
  }

  var googleMapVisible = $('#div_mapContainer').css('display');

	if(googleMapVisible == 'none'){
		$('#div_mapContainer').show();
		//TODO Identify where #filterContainer is
		$('#filterContainer').show();
		$('#div_headerContainer ').addClass('absoluteHeader');
		$('.pageContainer').hide();

		init();
	}

  $("#div_listCount").text(getLocalizedString('hotel-finder.loading'));
  $('#div_sort').hide();
  $("#div_priceUpdateNotice").hide();

	var userQuery = $('#ip_travelRequest').val();

  deactive_tiptip();
  if (isSearchPage()) {
    App.searchView.hideDetailsPane();
  }
	
	//remove any exact address match marker
	if(exactAddressContent != null) {
		exactAddressContent.remove();
	}

  // Address search, user query has 'address: ...'
	if (userQuery.indexOf(addressPrefix) == 0) {
		zoomExplicitily = true;
		clearNLPData();

		$('.nonClickableTag').remove();
		$('.clickableTag').remove();
		//Adding dates to datepicker only if nlp recognizes events
		if($("#ip_dpfrom").val().indexOf('/') == -1 && $("#ip_dpto").val().indexOf('/') == -1) {
			$("#ip_dpfrom").addClass('chooseDate');
			$("#ip_dpfromShow").addClass('chooseDate');
			$("#ip_dpto").addClass('chooseDate');
			$("#ip_dptoShow").addClass('chooseDate');
		}
		else {
			$("#ip_dpfrom").removeClass('chooseDate');
			$("#ip_dpfromShow").removeClass('chooseDate');
			$("#ip_dpto").removeClass('chooseDate');
			$("#ip_dptoShow").removeClass('chooseDate');
		}

		var address = userQuery.substr(addressPrefix.length);
		mapViewChangedCount = 0;
    // For address queries, searching won't happen until the map moves
    isSearchInProgress = false;
		updateViewport(address, addressZoomLevel, 'Address Prefix ');		

	}
	// Nautilus search
  else {
    var searchParams = {
			query: userQuery
		};

    App.Services.HotelSearch.getResults(searchParams, true, function (err, result) {

      // Error, sending an empty list will reset side bar
      if (err || result === undefined || result.RAW === undefined || result.PARSE === undefined) {
        App.searchView.addAllItemsToListView([]);
        return;
      }

      nautilusData = JSON.stringify(result);

      // Nautilus recognized a date concept, set date picker
      if(result.PARSE.START_DATE !== undefined && result.PARSE.END_DATE !== undefined) {
        $("#ip_dpto").datepicker("setDate", dateFormatTransfer(result.PARSE.END_DATE));
        $("#ip_dpfrom").datepicker("setDate", dateFormatTransfer(result.PARSE.START_DATE));
      }

      //Adding dates to datepicker only if nlp recognizes events
      if($("#ip_dpfrom").val().indexOf('/') == -1 && $("#ip_dpto").val().indexOf('/') == -1) {
        $("#ip_dpfrom").addClass('chooseDate');
        $("#ip_dpfromShow").addClass('chooseDate');
        $("#ip_dpto").addClass('chooseDate');
        $("#ip_dptoShow").addClass('chooseDate');
        $("#ip_dpfromShow").css('color','#999');
        $("#ip_dptoShow").css('color','#999');
      }
      else {
        $("#ip_dpfrom").removeClass('chooseDate');
        $("#ip_dpfromShow").removeClass('chooseDate');
        $("#ip_dpto").removeClass('chooseDate');
        $("#ip_dptoShow").removeClass('chooseDate');
        $("#ip_dpfromShow").css('color','#222');
        $("#ip_dptoShow").css('color','#222');
      }

      mapViewChangedCount = 0;
      parseNautilusResult(result);
    });
  }

  setTimeout(function () {
    $("#ip_travelRequest").autocomplete('close');
    autoCompleteSelected = false;
  }, 800);
}

function parseNautilusResult (result) {
  var parse = result.PARSE;

	$('.nonClickableTag').remove();
	$('.clickableTag').remove();
	clearNLPData();
	clearAmentityFilter();
	updateAmenityLabel();
	itemsvcHotel.clearItems();

  if (parse.MATCH === 'AMBIG') {
    nautilusAmbiguousQuery(parse);
    return;
  }


  if (parse.ADDRESS) {
    nautilusAddressQuery(parse);
  }
  else if (parse.MATCH === 'EXACT' && parse.LOCATION) {
    nautilusRegionExactQuery(parse);
  }
  else if (parse.MATCH === 'EXACT' && parse.HOTEL) {
    nautilusHotelExactQuery(parse);
  }

  // Place additional POI markers on the map
  if (parse.POIS) {
    App.searchView.putAllPOIMarkersOnMap(parse.POIS);
  }

	var containsPartialHotels = false;
  // Set hotels for this search
  if (parse.HOTELS) {
		if (!_.isEmpty(parse.HOTEL_PARTIALS)) {
			App.nautilusHotels = parse.HOTELS.concat({}).concat(parse.HOTEL_PARTIALS);
			containsPartialHotels = true;
		}
		else {
			App.nautilusHotels = parse.HOTELS;
		}
  }
	// Clusters for higher level regions
	else if (parse.CLUSTERS) {
		App.nautilusHotels = parse.CLUSTERS;
	}
  // Set to empty if no hotels or clusters
  else {
    App.nautilusHotels = [];
  }

	addHotelsToList(App.nautilusHotels, containsPartialHotels);

  itemsvcHotel.clearItemsRequests();
}

function nautilusAmbiguousQuery (result) {

  var attributeString = App.searchView.getAttributeString(result),
      regex = new RegExp("'", 'g');

  $('#ul_disambigOptions').empty();

  for(var x = 0; x < result.CLUSTERS.length; x++) {
    var tempData = JSON.stringify(result.CLUSTERS[x]),
        listItem = '';

    if(result.CLUSTERS[x].preferredEntity === 'HOTELS') {
      var regionName = '';
      if(typeof(result.CLUSTERS[x].regions) !== "undefined"){
        regionName = result.CLUSTERS[x].regions[0].name;
      }
      listItem = "<li id=\"li_ambigHotel_"+result.CLUSTERS[x].hotels[0].id+"\"><a id=\"lnk_ambigHotel_"+result.CLUSTERS[x].hotels[0].id+"\" onclick='App.searchView.disambigSearchResults("+tempData.replace(regex,"&#39;")+","+JSON.stringify(result).replace(regex,"&#39;")+")'><div class=\"disambigIcon hotelDisambigIcon\"></div>"+result.CLUSTERS[x].hotels[0].name+"</a> "+regionName+"</li>";
    }
    else if(result.CLUSTERS[x].preferredEntity === 'REGIONS') {
      if(typeof(result.CLUSTERS[x].regions) !== "undefined"){
        if(result.CLUSTERS[x].regions[0].type === 'point_of_interest_shadow'){
          listItem = "<li id=\"li_ambigRegion_"+result.CLUSTERS[x].regions[0].id+"\"><a id=\"lnk_ambigRegion_"+result.CLUSTERS[x].regions[0].id+"\" onclick='App.searchView.disambigSearchResults("+tempData.replace(regex,"&#39;")+","+JSON.stringify(result).replace(regex,"&#39;")+")'><div class=\"disambigIcon poiDisambigIcon\"></div>"+result.CLUSTERS[x].regions[0].name+"</a>"+attributeString+"</li>";
        }
        else{
          listItem = "<li id=\"li_ambigRegion_"+result.CLUSTERS[x].regions[0].id+"\"><a id=\"lnk_ambigRegion_"+result.CLUSTERS[x].regions[0].id+"\" onclick='App.searchView.disambigSearchResults("+tempData.replace(regex,"&#39;")+","+JSON.stringify(result).replace(regex,"&#39;")+")'><div class=\"disambigIcon regionDisambigIcon\"></div>"+result.CLUSTERS[x].regions[0].name+"</a>"+attributeString+"</li>";
        }
      }
      else {
        continue;
      }
    }
    $('#ul_disambigOptions').append(listItem);

    if (isSearchPage()) {
			App.searchView.removeAllItemsFromMap();
			App.searchView.addAllItemsToListView([]);
      App.listView.collection.reset();

    }
  }

  var event;
  App.searchView.ambigHelper(result);
  openSettingsDialog(event, $('#div_disambigDialog'));
  $('.customCloseIcon').click();
  $('#div_ambigFeedback').show();
  $('#div_ambigDown').hide();
  $('#div_ambigUp').hide();
  $('#div_ambigFinal').hide();
  App.searchView.addAllItemsToListView([]);
}

function nautilusAddressQuery (result) {

  App.searchView.handleFilterAttributes(result);

  updateViewport(result.ADDRESS, addressZoomLevel, result.FEEDBACK);
  App.searchView.putVotingPop();
  App.searchView.removePOIMarkersFromMap();
  App.searchView.removeMissingHotelMarkerFromMap();
}

function nautilusRegionExactQuery (result) {

  App.searchView.handleFilterAttributes(result);

	// Result has the region polygon, form bounds from polygon
	if (result.REGION && result.REGION.polygon) {
		moveMapToPolygon(result.REGION.polygon);
	}
	// Result has an exact SW, NE viewport
	else if (result.VIEWPORT) {
		boundsBasedZoom(result.VIEWPORT.NE.lat, result.VIEWPORT.NE.lng, result.VIEWPORT.SW.lat, result.VIEWPORT.SW.lng);
	}

  if (result.LOCATION) {
    createLocationTag(result.LOCATION);
  }

  if (nlpbrand != '') {
    createBrandNameTag(nlpbrand.split(','));
  }

  App.searchView.putVotingPop();
  App.searchView.removePOIMarkersFromMap();
  App.searchView.removeMissingHotelMarkerFromMap();

  // Exact region match to a POI, place special large POI marker on map
  if(result.TYPE === 'POI') {
    App.searchView.putPOIMarkerOnMap(result.POIS[0], 'poiMarkerSpecial');
  }
}

/**
 * Create the HTML for the location tag in the header bar and place it on the page
 * @param {String} location
 */
function createLocationTag (location) {
  var regex = new RegExp("'", 'g');

  if(!_.isEmpty(location) && location.length > locationTagLength) {
    var showRegion = location.substring(0, locationTagLength);
    $('#div_tagContainer').before("<span class=\"nonClickableTag truncatedTag\"  tagData=\""+location.replace(regex,"&#39;")+"\" onmouseover=\'App.searchView.showTagTooltip(\""+location.replace(regex,"&#39;")+"\",event)\'>"+showRegion+"...</span>");
  }
  else if(!_.isEmpty(location) && location.length <= locationTagLength) {
    $('#div_tagContainer').before("<span class='nonClickableTag' tagData=\""+location.replace(regex,"&#39;")+"\">"+location+"</span>");
  }
}

/**
 * Create the HTML for the brand name tags in the header bar and place them on the page
 * @param {Array} nlpBrandNames - An array of brand names
 */
function createBrandNameTag (nlpBrandNames) {
  if (!_.isEmpty(nlpBrandNames)) {
    for (var tempCount=0; tempCount < nlpBrandNames.length; tempCount++) {

      var brandName = nlpBrandNames[tempCount],
          regex = new RegExp("'", 'g');

      if (!_.isEmpty(brandName) && brandName.length > brandNameTagLength) {
        var showBrand = brandName.substring(0,brandNameTagLength);
        $('#div_tagContainer').before("<span class=\"clickableTag  truncatedTag\" tagData=\""+brandName.replace(regex,"&#39;")+"\" onmouseover=\'App.searchView.showTagTooltip(\""+brandName.replace(regex,"&#39;")+"\",event)\'>"+showBrand+"...<span class='clickableTagCloseIcon'></span></span>");
      }
      else if (!_.isEmpty(brandName) && brandName.length <= brandNameTagLength) {
        $('#div_tagContainer').before("<span class=\"clickableTag\" tagData=\""+brandName.replace(regex,"&#39;")+"\">"+brandName+"<span class='clickableTagCloseIcon'></span></span>");
      }
    }
  }
}

function nautilusHotelExactQuery (result) {

  App.searchView.handleFilterAttributes(result);

  // Moving the map to center on exact hotel will render other content on map
  if(result.CENTER !== undefined) {
    var center = new expedia.dmap.LatLong(result.CENTER.lat,result.CENTER.lng),
        regex = new RegExp("'", 'g');

    map.setCenter(center);
    map.setZoom(zoom);

    if(!_.isEmpty(result.HOTEL) && result.HOTEL.length > 20) {
      var showHotel = result.HOTEL.substring(0,20);
      $('#div_tagContainer').before("<span class=\"nonClickableTag truncatedTag\" tagData=\""+result.HOTEL.replace(regex,"&#39;")+"\" onmouseover=\'App.searchView.showTagTooltip(\""+result.HOTEL.replace(regex,"&#39;")+"\",event)\'>"+showHotel+"...</span>");
    }
    else if(!_.isEmpty(result.HOTEL) && result.HOTEL.length <= 20) {
      $('#div_tagContainer').before("<span class='nonClickableTag' tagData=\""+result.HOTEL.replace(regex,"&#39;")+"\">"+result.HOTEL+"</span>");
    }

    App.searchView.putVotingPop();
  }

  itemsvcHotel.clearItemsRequests();
}

//this is used for address resolving only
function updateViewport(location, zoomLevel) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':location}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
      var address = results[0].formatted_address,
          lat = results[0].geometry.location.lat(),
          lng = results[0].geometry.location.lng(),
          center = new expedia.dmap.LatLong(lat,lng);

      map.setCenter(center);
      map.setZoom(zoomLevel);

      //Set the global exact address content to be the address coordinates
      //map, position, opts
      exactAddressContent = new Content(map, center, {
        id : 'exactAddressMarkerDiv',
        className : 'exactAddressMarker',
        events: {
          'mouse_enter': function(event) {
            event = event ? event : window.event;
            var target;
            if (typeof event.target == 'undefined') {
              target = $(event.srcElement);
            }
            else {
              target = $(event.target);
            }
            var ele = document.getElementById('exactAddressMarkerDiv');
            $(ele).tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: address});
          },
          'mouse_exit' : function() {
            deactive_tiptip();
          }
        }
      });

      itemsvcHotel.makeRequests();
      itemsvcHotel.clearItemsRequests();

			createLocationTag(address);
    }
    else {
      //We are going to implement the function to track the error message in capture service for instrumentation.
    }
  });
}

function updateMapConfig(){
	map.config.height = parseInt($("#div_mapContainer").height()) - 50;
	map.config.width = parseInt($("#div_mapContainer").width()) - 50;
}

function boundsBasedZoom(nelat, nelng, swlat, swlng) {
	var	neLatLong = new expedia.dmap.LatLong(nelat, nelng);
	var	swLatLong = new expedia.dmap.LatLong(swlat, swlng);
  itemsvcHotel.clearItems();
	map.fitBounds(new expedia.dmap.Bounds(neLatLong, swLatLong));
}

/**
 * Sets the map to a bounding box that includes all the points in polygon.
 * A point is an {Object} with the keys ['lat, 'lng']
 *
 * @param {Array} polygon - Array of points
 */
function moveMapToPolygon(polygon) {
	var points = [];

	polygon.forEach(function (point) {
		points.push(new expedia.dmap.LatLong(point.lat, point.lng));
	});

	itemsvcHotel.clearItems();
	map.fitBounds(expedia.dmap.Bounds.fromLatLongs(points));
}

function centerBasedZoom(lat, lng) {
	itemsvcHotel.clearItems();
  map.setCenter(new expedia.dmap.LatLong(lat, lng));
	map.setZoom(aggrZoomLevel);
}

function centerToUS(){
	moveMapToPolygon(usaPolygon);
}

function isExtraFilter(fId){

	var isExtraFilter = true;
	$('.filterMenu li[id]').each(function(){
		if(fId == $(this).attr('id')){
			isExtraFilter =  false;
		}
	});
	return isExtraFilter;
}

function addExtraFilter(containerId, fId){
  var friendlyText = createFriendlyAttributeTextFromId(fId);

	$('#' + containerId + '>ul').prepend('<li class="extraFilter on" id="' +fId +'"> ' + friendlyText +'</li>');
}

/**
 * Create user friendly text from a Nautilus attribute id
 * @param {String} nautilusId - Nautilus id to convert
 * @returns {String} User friendly text or empty string
 *
 */
function createFriendlyAttributeTextFromId(nautilusId) {
  var text = '';
  if (_.isString(nautilusId)) {
    text = lodash.startCase(nautilusId.toLowerCase());
  }
  return text;
}

function addNewStarRatingListFilterGivenRating(starRating) {
	
	var idSuffix = parseInt(starRating),
	    id = 'star-' + starRating + '-' + idSuffix;

	addNewStarRatingListFilterWithClass( id, starRating, "extraFilter on" );
}

function addStarRatingListFilterGivenId(starRatingId){
	
	var stars = parseInt( starRatingId.split( '-' )[1]);
	
	addNewStarRatingListFilterWithClass( starRatingId, stars, "extraFilter" );
}

function addNewStarRatingListFilterWithClass(id, stars, className) {
	
	var label = (stars == 1)
		? getLocalizedString('hotel-finder.filter.rating.start.item.only.single')
		: getLocalizedString('hotel-finder.filter.rating.start.item.only.multiple').replace('{0}', stars);
	
	var element = $('#ul_starRating');
	element.children().removeClass('on');
	element.prepend('<li class="' + className + '" id="' + id + '"><label>' + label + '</label><span count="0">(0)</span></li>');
}

function selectAmenityFilter(fId){

	if($('#'+ fId).parent().parent().hasClass('hasSub')) {
		//console.log('hasSub');
		$('#'+ fId).parent().show();
		$('#'+ fId).parent().parent().find('h4').addClass("subOff");
		$('li',$('#'+ fId).parent()).removeClass('on');
		$('#'+ fId).addClass('on');
	}
  else {
		$('#'+ fId).addClass('on');
	}
}

function clearAmentityFilter(){
	$('.filterMenu ul.multiSelect li').removeClass("on");
	$('#div_starRatingList li').removeClass('on');
	$('#div_priceList li').removeClass('on');
	$('.filterMenu h4').removeClass("subOff");
	$('.filterMenu li.extraFilter').remove();
	$('.filterMenu .hasSub ul').hide();
	$('#ip_hotelRefine').val('');
	$('#ip_hotelRefine').focus();
	$('#ip_travelRequest').focus();
	$('#ip_travelRequest').val($('#ip_travelRequest').val());

	$("#div_starRatingList ul.singleSelect li:first-child").addClass("on");
	$("#div_priceList ul.singleSelect li:first-child").addClass("on");
}

function updateAmenityLabel(){
	var amentiyNum = $("#div_amenitiesList ul li.on").length,
      themeNum = $("#div_themesList ul li.on").length,
      amenityLabel = '',
      amenityColor = '',
      themeLabel = '',
      themeColor = '',
	    starRatingNum = $("#div_starRatingList ul li.on").length,
      priceColor = '#FFF',
      priceLabel = getLocalizedPriceFilterTitle(),
      starRatingColor = '#FFF',
      starRatingLabel = getLocalizedStarRatingFilterTitle();

  if (amentiyNum === 0 || amentiyNum === undefined) {
    amenityLabel = getLocalizedAmenitiesFilterTitle();
    amenityColor = "#222";
    $(".filterWrapper .amenities").css("background-color",'');
    $(".filterWrapper .amenities span.menu-label").html(amenityLabel).css("color",amenityColor);
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").removeClass("greyDownIconActive");
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").addClass("greyDownIcon");
  }
  else if (amentiyNum === 1) {
    amenityLabel = $("#div_amenitiesList ul li.on").eq(0).html();
    amenityColor = "#FFF";
    $(".filterWrapper .amenities").css("background-color","#02ADF7");
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").removeClass("greyDownIcon");
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").addClass("greyDownIconActive");
    $(".filterWrapper .amenities span.menu-label").html(amenityLabel).css("color",amenityColor);
  }
  else if (amentiyNum > 1) {
    amenityLabel = $("#div_amenitiesList ul li.on").eq(0).html() + " + " + (amentiyNum - 1);
    amenityColor = "#FFF";
    $(".filterWrapper .amenities").css("background-color","#02ADF7");
    $(".filterWrapper .amenities span.menu-label").html(amenityLabel).css("color",amenityColor);
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").removeClass("greyDownIcon");
    $(".filterWrapper .amenities span#spn_amenitiesGreyDownIcon").addClass("greyDownIconActive");
  }

  if (themeNum == 0) {
    themeLabel = getLocalizedThemesFilterTitle();
    themeColor = "#222";
    $(".filterWrapper .themes").css("background-color",'');
    $(".filterWrapper .themes span.menu-label").html(themeLabel).css("color",themeColor);
    $(".filterWrapper .themes span#spn_themes").removeClass("greyDownIconActive");
    $(".filterWrapper .themes span#spn_themes").addClass("greyDownIcon");
  }
  else if (themeNum == 1) {
    themeLabel = $("#div_themesList ul li.on").eq(0).html();
    themeColor = "#FFF";
    $(".filterWrapper .themes").css("background-color","#02ADF7");
    $(".filterWrapper .themes span.menu-label").html(themeLabel).css("color",themeColor);
    $(".filterWrapper .themes span#spn_themes").removeClass("greyDownIcon");
    $(".filterWrapper .themes span#spn_themes").addClass("greyDownIconActive");
  }
  else if (themeNum > 1) {
    themeLabel = $("#div_themesList ul li.on").eq(0).html() + " + " + (themeNum - 1);
    themeColor = "#FFF";
    $(".filterWrapper .themes").css("background-color","#02ADF7");
    $(".filterWrapper .themes span.menu-label").html(themeLabel).css("color",themeColor);
    $(".filterWrapper .themes span#spn_themes").removeClass("greyDownIcon");
    $(".filterWrapper .themes span#spn_themes").addClass("greyDownIconActive");
  }

  if(starRatingNum > 0 && !$('#anyStar').hasClass('on')){
    starRatingLabel = $("#div_starRatingList ul li.on label").eq(0).html();
    starRatingColor = "#FFF";
    $(".filterWrapper .starRating").css("background-color","#02ADF7");
    $(".filterWrapper .starRating span.menu-label").html(starRatingLabel).css("color", starRatingColor);
    $(".filterWrapper .starRating span#spn_starGreyDownIcon").removeClass("greyDownIcon");
    $(".filterWrapper .starRating span#spn_starGreyDownIcon").addClass("greyDownIconActive");
  }
  else if($('#anyStar').hasClass('on')) {
    $(".filterWrapper .starRating").css("background-color",'');
    $(".filterWrapper .starRating span.menu-label").html(starRatingLabel).css("color", "#222");
    $(".filterWrapper .starRating span#spn_starGreyDownIcon").removeClass("greyDownIconActive");
    $(".filterWrapper .starRating span#spn_starGreyDownIcon").addClass("greyDownIcon");
  }

  if(!$('#li_anyPrice').hasClass('on')){
    $(".filterWrapper .price").css("background-color","#02ADF7");
    $(".filterWrapper .price span.menu-label").html(priceLabel).css("color",priceColor);
    $(".filterWrapper .price span#spn_priceGreyDownIcon").removeClass("greyDownIcon");
    $(".filterWrapper .price span#spn_priceGreyDownIcon").addClass("greyDownIconActive");
  }
  else if($('#li_anyPrice').hasClass('on')) {
    $(".filterWrapper .price").css("background-color",'');
    $(".filterWrapper .price span.menu-label").html(priceLabel).css("color","#222");
    $(".filterWrapper .price span#spn_priceGreyDownIcon").removeClass("greyDownIconActive");
    $(".filterWrapper .price span#spn_priceGreyDownIcon").addClass("greyDownIcon");
  }

}

String.prototype.amenityAdd = function () {
	var args = arguments;
	if (this.indexOf(args[0]) > -1) {
		if (this.length > 0)
			return this.substr(0, this.length - 5);
		return this;
	}
	else
		return this + args[0];
};

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined'
			? args[number]
		: match
		;
	});
};

function resultListScroll(oEment) {
	if($(oEment).length==0)return;
	var Top_oEment = $(oEment).offset().top;
	var T_scroll = $("#div_resultsList").scrollTop();
	var headerH = parseInt($("#div_headerContainer").outerHeight() +  $('.filterBarContainer').outerHeight() + $('#div_resultsInfoContainer').outerHeight());

  $("#div_resultsList").scrollTop(Top_oEment + T_scroll - headerH - 54);
}

function getBriefContent(target) {

  var id = target.attr('id'),
			hid = 'h' + id;

	if (_.isEmpty(id)) {
		window.location.href = 'hotelfinder?from=login';
		return;
	}

	App.Services.HotelBrief.getHotelBriefContent(id, function (err, data) {
		if (err || data == undefined) {
			window.location.href = 'hotelfinder?from=login';
			return;
		}

		// Set the hotel name on the details pane hotelbrief returned null
		var hotelName = $('#' + hid).find('.hotel-name').text();
		data.name = data.name || hotelName || '';

		App.searchView.updateDetailsPaneContent(data);
	});
}

function renderHotel(sendRequest) {
	if(renderHotelHandler != null) {
		clearTimeout(renderHotelHandler);
	}

	renderHotelHandler = setTimeout(function() {
    renderHotelHandle(sendRequest);
  },600);
}

function renderHotelHandle(sendRequest) {
	if ( sessionStorage.getItem("userPrefsExist") != undefined ) {
		// There are still some user preferences to be set before
		// the hotels should be rendered.
		return;
	}

	// Puts a marker anywhere an Item is present, and loads Hotels from service, showing hover bubble
  App.searchView.hideDetailsPane();

	itemsvcHotel.clearItems();
	Hotels.length = 0;
  App.nautilusHotels = [];

	updateHotelRequest();

	updateMapConfig();
	// Since the evaluate call happens after the map loaded, need to explicitly call makeRequests
	if( sendRequest == true ) {
		itemsvcHotel.makeRequests();
		itemsvcHotel.clearItemsRequests();
	}
}

function getAffinityCategory(affinityId){
	var affinityAttribute = lcmAffinityMappingData[affinityId];
	var category = '';
	if(affinityAttribute!=null){
		category =  affinityAttribute['Category'];
	}
	return category; 
}

function addHotelsToList (hotels, containsPartialHotels) {

  if(addHotelToListHandler != null) {
    clearTimeout(addHotelToListHandler);
  }

  addHotelToListHandler = setTimeout(function() {
    App.searchView.addAllItemsToListView(hotels, containsPartialHotels);
  }, 500);
}

function clearFilterCount(){
	$('#div_priceList li span').attr('count','0');
	$('#div_priceList li span').html('(0)');

	$('#div_starRatingList li span').attr('count','0');
	$('#div_starRatingList li span').html('(0)');
}

/**
 * Format the star rating for css styles implented in the 10s values of stars. (10,15,20,...50)
 * We cannot have '4.5' in the css class
 *
 * @param itemStarRating
 * @returns {Number}
 */
function formatStarRating (itemStarRating) {
	return parseInt(itemStarRating * 10);
}

function updateHotelRequest() {
	//request all the available information for hotels
	var date1 = Date.parse($("#ip_dpfrom").val());
	var date2 = Date.parse($("#ip_dpto").val());

	var hotelItemRequest = {
			eanHotelsOnly: true,
			star: {
				min: nlpStarMin,
				max: nlpStarMax
			}, 
			brand: nlpbrand, //filter by brand
			rooms: eval(roomFilter), //filter by room and adult and child
			amenityids: nlpAmenityIds,
			price: nlpPrice,
			hotelSortOrder: nlpSortOrder,
			name: nlpHotelName,
			ids: nlpHotelIds,
			currencyCode: getCurrencyCode(),
			language: getLocaleId()
	};

	if(!isNaN(date1)&&!isNaN(date2)) {

		var d1 = new Date(date1),
		    d2 = new Date(date2),
		    los = Math.round((d2-d1)/msInADay);

		$.extend(hotelItemRequest, {
      dates: {
        min: d1,
        max: d1,
        los: {min:los, max:los}
      }
    });
  }

  itemsvcHotel.addItemsRequest({
    'hotels': hotelItemRequest
  });

	//Request map item types
	itemsvcHotel.addItemsRequest({
		'mapItems': {
			types: 'hotel',
			maxResults: App.listView.maxResultCount,
			maxAggregationResults: App.listView.maxAggrResultCount,
			aggregationZoomLevel: aggrZoomLevel
		}
	});
}

function chooseDate(){
	$('#ip_dpfrom').focus();
}

function chooseGuest(){
	setTimeout(function(){
		$('#spn_roomSelect').click();
	},200);
}

function dateFormatTransfer (val) {
	var temp = val.substr(0,10),
      array = temp.split('-');

	return array[1]+'/'+ array[2] +'/'+array[0];
}

function generateMediaUrl(hotelThumbnail){
	var index = hotelThumbnail.indexOf('_'),
      hotelId = parseInt(hotelThumbnail.substr(0, index)),
	    mete = 1000000,
	    sb = MEDIA_PATH;

  for (var i = 0; i < 4; i++) {
		var top = parseInt(hotelId / mete) + (hotelId % mete > 0 ? 1 : 0);
		sb += '/' + (mete*top);
		mete /= 100;
	}
	sb += '/' + hotelThumbnail;
 	return sb;
}

// TODO: This method should be deprecated
function handleImage(imageUrl, hotelId) {
  var imgElem = '';

	if(imageUrl != null && imageUrl != 'NULL') {
		imageUrl = imageUrl.replace('_t.jpg','_l.jpg');
		var imgSrc = generateMediaUrl(imageUrl);
    imgElem = "<div id=\"div_hotel_" + hotelId + "\" class=\"hotel-img floatL\" style=\"background-image:url(" + imgSrc + ");\"></div>";
	}

  else {
    imgElem = "<div id=\"div_hotel_" + hotelId + "\" class=\"hotel-img floatL\" style=\"background-image:url(\"\");\"></div>";
	}

	return imgElem;
}

function onPageReady() {
  var travelRequest = $('#ip_travelRequest');

	travelRequest.keydown(function (event) {
		event.stopPropagation();
    e = event;
    getOldValue();

    // If user presses CTRL + ALT + i, open parse window
    if(e.which == 17) isCtrl=true;
    if(e.which == 18) isAlt=true;
    if(e.which == 73 && isCtrl == true && isAlt == true) {
      openParseWindow();
    }
  })
  .keyup(function(event){
    e = event;
    getData();

    if(e.which == 17) isCtrl=false;
    if(e.which == 18) isAlt=false;
  })
	.focus(function(){
		$("#ip_travelRequest").css("border-color","#08B6FF");
	})
  .blur(function(){
		$("#ip_travelRequest").css("border-color","#006699");
	})
  .focus().val( travelRequest.val())
	.css("border-color", "#08B6FF");

	getGemmaServerData();
	getLcmAffinityMappings();
	getPriceMarkerNum();
	getPriceRange();
	Semantha.onLoad();

	// Bind the click event to window
	$('body').click(function (event) {
		if(event.target.id.indexOf('parse')>-1||
				event.target.id == 'lblTimeUsed' ||
				event.target.id == 'fancyBoxLink') return true;
		if (($(event.target).closest('.ui-dialog')).length > 0) {
			// if clicked on a dialog, do nothing
			return true;
		} else {
			// if clicked outside the dialog, close it
			// jQuery-UI dialog adds ui-dialog-content class to the dialog element.
			// with the following selector, we are sure that any visible dialog is closed.
			$('#div_parsePopup').dialog('close');

		}
	});

	$("a#fancyBoxLink").click(function () { openParseWindow(); });
  roomFilter = getRoomFilterJSON();
}

function searchIconClick() {
  $('#lnk_search').css('display', 'none');
  $('#lnk_nosearch').css('display', 'block');
  createTravelRequest('Manual', 'SearchBoxIconClick');
}

function clearNLPData(){
	nlpHotelIds = null;
	nlpAmenities = null;
	nlpAmenityIds = null;
	nlpStarMin = 0;
	nlpStarMax = 0;
	nlpPrice = {};
	nlpbrand = '';
	nlpHotelName = '';
	nlpSortOrder ='EXPEDIA_PICKS';
}

function clearPopup(){

    var votingContainer = $('.votingContainer');
    if (votingContainer != undefined) {
      votingContainer.hide();
    }

    closeSettingsPopupDialogs();

    if (isSearchPage()) {

    	App.searchView.hideDetailsPane();

      var poptip = $('.poptip');
      if($.browser.msie && $.browser.version<=8) {
        poptip.css('min-width','175px');
      }
      else {
        poptip.css('position','fixed');
        poptip.css('min-width','175px');
      }
    }
}

function isSearchPage() {
  var resultsListExists = document.getElementById('div_resultsListContainer');
  return !!resultsListExists;
}
