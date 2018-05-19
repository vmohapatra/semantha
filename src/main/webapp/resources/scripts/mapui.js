var itemsvcPOI,itemsvcHotel;
var nlpStar=0;
var nlpbrand="";
var nlpAmenityIds = [];
var nlpBrandIds=[];
var nlpAmenities = [];
var nlpPrice = {};
var nlpXmlData;
var hoverBox;
var minZoomLevel = 1;
var nlpLocation;
var zoom;
var previoustag;
var oldzindex = 0;
var firstfill = 0;
var Hotels = createArray(1, 8);

var nlpStarMin;
var nlpStarMax;
var roomFilter="";
var isHotelDetail;
var msInADay = 1000*60*60*24;
var isCtrl = false;
var isAlt = false;
var priceMarkerNum = 10;
var requestTime=0;
var nlpSortOrder = 'aidep_PICKS';
var nlpHotelName = '';
var nlpHotelIds = [];
var nlpHotelNames = [];
var isStreetView = false;
var autoCompleteSelected = false;
var ZOOM_LOCATION_TYPES=["street_address", "intersection", "premise", "subpremise", "airport"];
var nonHotelArray = ['Car','Cruise', 'Flight', 'Package'];
var addressPrefix = 'address:';
var addressZoomLevel = 14;
var eventZoomLevel = 13;
var aggrZoomLevel = 9;
var resultCount = 200;
var aggrResultCount = 20;
var mapViewChangedCount = 0;
var zoomExplicitily = false;

function getRoomFilterJSON()
{
	//rooms:[{AdultCount:2,ChildAges:[5,12]}, {AdultCount:1}]
	var sb=new StringBuilder();
	sb.append("[");

	$("#roomsGuests .roomItem.clearfix").each(function(i){
		sb.append("{");
		var adultsCount = $(this).find(".adultsCount").val();
		sb.append("\"AdultCount\":"+adultsCount);
		childrenCount = $(this).find(".children").find("select").val();
		if(childrenCount<=0){
			sb.append("},");
		}
		else
		{
			sb.append(",\"ChildAges\":[");

			$(this).find(".childAge.clearfix").find("select").each(function(j,obj){
				if($(obj).attr("disabled")!="disabled")
				{
					childAge = $(obj).val();
					sb.append(childAge+",");
				}
			});
			sb.append("]},");
		}

	});
	sb.append("]");
	return sb.toString().replace(/,]/g,"]");
}

function constructRoomFilter()
{
    roomFilter=getRoomFilterJSON();
    //if (nlpLocation)
    //	if(nlpLocation.length>0)
    //   renderMap(nlpLocation);
    //	{
    if($('#GoogleMap').length>0){
        renderHotel(true);
    }


    //console.log("room and guest trigger render");
    //	}
    sendCaptureRequest('RoomGuestsUpdate','RoomGuestsUpdateSearch', true);
}

function addCaptureInfo(url){
	var searchQueryId = null;
	var browserGUID = null;
	var result = null;
	if(captureCommonData != null){
		searchQueryId =captureCommonData['UV.SearchQueryId'];
		browserGUID = captureCommonData['UV.BrowserGUID'];
	}else{
		searchQueryId = getGUID();
		browserGUID = getGUID();
	}
	result = url + '&searchQueryId=' + searchQueryId + '&browserGUID=' +browserGUID;
	return result;
}

function hoteldetailsURL(id, prefix){
	//var url = '/sphinx/hoteldetails?';
	var url = prefix;
	// var hotelId = id;
	var hotelId = id;
	var arrivalDate = $("#dpfrom").val();
	if(arrivalDate==null||arrivalDate==getLocalizedDatePickerDefaultStartDate())
		arrivalDate="";
	var departureDate = $("#dpto").val();
	if(departureDate==null||departureDate==getLocalizedDatePickerDefaultEndDate())
		departureDate="";
	url = url + "hotelId=" + hotelId + "&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + "&query=" + $('#travelRequest').val();

	url = addCaptureInfo(url);

	var roomdetails = "";
	var adultsCount;
	var childrenCount;
	var childAge;
	var flag = true;
	$("#roomsGuests .roomItem.clearfix").each(function(i){
		roomdetails = roomdetails + (i == 0 ? "" : "-");
		adultsCount = $(this).find(".adultsCount").val();
		roomdetails = roomdetails + adultsCount;
		childrenCount = $(this).find(".children").find("select").val();
		if(childrenCount<=0)
			return true;
		$(this).find(".childAge.clearfix").find("select").each(function(j,obj){
			if($(obj).attr("disabled")=="disabled")
				return true;
			childAge = $(obj).val();
			reg=/^\d+$/;
			if(!reg.test(childAge)){
				//flag = false;
				return false;
			}else{
				roomdetails = roomdetails + "," + $(obj).val();
			}

		});
		if(!flag){
			return false;
		}
	});
	if(flag){
		url = url + "&roomdetails=" + roomdetails;
		//window.open(url);
	}else{
		//alert("Please correct the errors above before proceeding");
		return null;
	}
	return url;
}

function hoteldetails(id){
	var url = hoteldetailsURL(id, '/sphinx/hoteldetails?');

	// console.log(url);
	if(url!=null){
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

function getIndexOfHotelId(a, v) {
	var l = Hotels.length;
	for (var k = 0; k < l; k++) {
		if (a[k][0] == v) {
			return k;
		}
	}
	return -1;
}

function detectBeachHotel(query) {
	if (query.indexOf("beach") < 0) return false;
	if (query.indexOf("hotel") < 0) return false;
	if (query.length > 15) return false;
	return true;
}

function sortMultiDimensional(a,b){
	// this sorts the array using the second element
	//console.log(Hotels.length);
	//if (Hotels.length == 0) return;
	//alert(parseFloat(a[2]));
	return ((parseFloat(a[2]) < parseFloat(b[2])) ? 1 : ((parseFloat(a[2]) >parseFloat(b[2])) ? -1 : 0));
	//return -1;
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

var eventMatchers = {
		'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
		'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};

var defaultOptions = {
		pointerX: 0,
		pointerY: 0,
		button: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true,
		cancelable: true
};

// Initialize the map
function initMap()
{
	var lat = getAndRemoveSessionStorageKey( "mapCenterLat" );
	var lng = getAndRemoveSessionStorageKey( "mapCenterLng" );
	var zoom = getAndRemoveSessionStorageKey( "mapZoom" );

	if ( lat == undefined || lng == undefined || zoom == undefined )
	{

		lat = 20.52382711348452;
		lng = -4.220000000000027 ;
		zoom = 14;
	}

	map = new aidep.dmap.google.Map(document.getElementById('GoogleMap'), {
		zoom: zoom,
		center: new aidep.dmap.LatLong( lat, lng ),
		zoomMax:19,
		zoomMin:2
	});


	var thePanorama = map.getMapProvider().getStreetView();

	google.maps.event.addListener(thePanorama, 'visible_changed', function() {
	    if (thePanorama.getVisible())
	    {
	        isStreetView = true;
	        $("div.tiptip_holder").css("display","none");
	    }
	    else
	    {
	    	isStreetView = false;
	    }
	});

	Hotels.length = 0;
	map.events.addEventListener('idle', function () {
		removeClickBubble();
		requestTime=0;
		mapLoaded();
	});

	map.events.addEventListener(aidep.dmap.Map.EVENT_CLICK, function (event) {
		deactive_tiptip();
		var target;
		if (typeof event.target == 'undefined')
		{
			target = $(event.srcElement);
		}
		else
		{
			target = $(event.target);
		}

		if (previoustag == undefined)
		{
			removeClickBubble();
		}
	});

	map.events.addEventListener(aidep.dmap.Map.EVENT_DOUBLE_CLICK, removeClickBubble);
	map.events.addEventListener(aidep.dmap.Map.EVENT_DOUBLE_CLICK, deactive_tiptip);

	map.events.addEventListener(aidep.dmap.Map.EVENT_CENTER_CHANGED, function(){
		updateMapConfig();

		removeClickBubble();
		//deactive_tiptip();
		//itemsvcHotel.clearItems();
		Hotels.length = 0;
		//console.log(mapViewChangedCount +":" + zoomExplicitily);
		if(mapViewChangedCount > 1){
			wrapLocation();
		}

		mapViewChangedCount++;
	});

	map.events.addEventListener(aidep.dmap.Map.EVENT_ZOOM_CHANGED, function () {
		if (hoverBox)
		{
			hoverBox.setOptions({content: ""});
		}

		//itemsvcHotel.clearItems();
		Hotels.length = 0;
		updateMapConfig();
		updateHotelRequest();
		removeClickBubble();
		//console.log(mapViewChangedCount +":" + zoomExplicitily);
		if((mapViewChangedCount > 1 && zoomExplicitily == false) ||
				(mapViewChangedCount > 2 && zoomExplicitily == true)){
			wrapLocation();
		}
		mapViewChangedCount++;
	});

	//itemsvcPOI = new ItemService(map, {removeItemsNotVisible:true});
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

	itemsvcHotel.events.addEventListener("requeststart", function(){
		requestTime++;
	});
	itemsvcHotel.events.addEventListener("requestend", function(){
		requestTime--;
	});
	itemsvcHotel.events.addEventListener("responseprocessed", function(){
		addHotelToList();
	});

	//itemsvcAirport = new ItemService(map, { removeItemsNotVisible: true });
	hoverBox = getHoverBox();
	fixInfoWindow();
	updateMapConfig();


	Content.trackItems(itemsvcHotel, {
		className: "hotel_available",
		events: {
			'click': function (event) {

				map.events.removeEventListener(aidep.dmap.Map.EVENT_CLICK, removeClickBubble);
				event = event ? event : window.event;
				var target;
				if (typeof event.target == 'undefined') {
					target = $(event.srcElement);
				} else {
					target = $(event.target);
				}

				if(target.hasClass("priceLabel") || target.hasClass("markerDot")) {
					target = target.parent();
				}

				var item = this.getItem(),
				data = item.getData();
				if(data.Type == 'hotel')
				{
					var selectedElementId = target.attr("id");
					var selectedHotelItem = "#h" + selectedElementId;
					if (target.attr("clickbubble") == '1') {
						removeClickBubble();
						$(selectedHotelItem).addClass("resultItemSelected");

						return;
					}
					removeClickBubble();
					var content = getBriefContent(target);
					if (target.hasClass("hotel_available") > 0)
					{
						$(".hotel_available").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: content, click: true });
					}
					else if (target.hasClass("priceMarker") > 0)
					{
						target.attr("class","priceMarkerHover");
						$(".priceMarker").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: content, click: true });
					}
					else
					{
					   $(".hotel_unavailable").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: content, click: true });
					}
					$(selectedHotelItem).addClass("resultItemSelected");

					if (triggerByItem == 0)
					{
						resultListScroll(selectedHotelItem);
					}

					previoustag = target;
					target.attr("clickbubble", '1');
					if (oldzindex == 0)
					{
						oldzindex = parseInt(target.css("z-index")) + 10000000;
					}
					else
					{
						oldzindex = oldzindex + 10;
					}
					target.css("z-index", oldzindex);
				}
 				else if(data.Type == 'hotelcluster')
				{
 				    //boundsBasedZoom(data.Bounds.NE.Lat, data.Bounds.NE.Lng, data.Bounds.SW.Lat, data.Bounds.SW.Lng);
 				    //$('div[class~aggregationMarker]').remove();
					centerBasedZoom(data.Border.Lat, data.Border.Lng);
				}
			},
			'mouse_enter': function (event) {

				// set the position for the hoverBox
				map.events.removeEventListener(aidep.dmap.Map.EVENT_CLICK, removeClickBubble);

				var item = this.getItem(),
				data = item.getData(),
				html = document.getElementById('hoverContent');

				// content is the HTML content. In this case, using a template DOM element instead of writing HTML directly
				document.getElementById('hoverTipHotelName').innerHTML = data.Name;
				if (data.Type == 'hotel' && data.HotelContent != undefined)
				{
					var avail = null;
					var hoverTipHotelStar = '<span class="hotelRating rating stars-lg ir"><span class="value stars' + data.HotelContent.StarRating + '"></span></span>';
					var hoverTipHotelPrice = "";
					if (data.HotelAvail) avail = data.HotelAvail;
					if(avail != null){
						if (avail.length) avail = avail[0];
						if (avail.Rate) rate = avail.Rate;
						if(rate!=null){
							if (rate.length) rate = rate[0];
							if (rate.Price)
							{
								hoverTipHotelPrice = rate.Price.PerNight.Text;
								$("#hoverTipHotelPrice").addClass("hoverTipHotelPrice");
								$("#hoverTipHotelPrice").css({"font-weight":"bold","color":"#555","display":"inline-block"});
							}
						}

					} else {
						hoverTipHotelPrice = getLocalizedString('hotel-finder.no-rooms');
						$("#hoverTipHotelPrice").css({"font-weight":"normal","color":"#999","display":"inline-block"});
					}


					document.getElementById('hoverTipHotelStar').innerHTML = hoverTipHotelStar;
					document.getElementById('hoverTipHotelPrice').innerHTML = hoverTipHotelPrice;
				}
				else if(data.Type == 'hotelcluster')
				{
					var label = (data.Size == 1)
						? getLocalizedString('hotel-finder.hotels-in-cluster.single')
						: getLocalizedString('hotel-finder.hotels-in-cluster.multiple').replace('{0}', data.Size);
					document.getElementById('hoverTipHotelStar').innerHTML=label;
					document.getElementById('hoverTipHotelPrice').innerHTML="";
					$("#hoverTipHotelPrice").css("display","none");
				}

				event = event ? event : window.event;
				var target;
				if (typeof event.target == 'undefined')
				{
					target = $(event.srcElement);
				}
				else
				{
					target = $(event.target);
				}

				if(target.hasClass("priceLabel") || target.hasClass("markerDot")) {
					target = target.parent();
				}

				previoustag = target;
				if (target.attr("clickbubble") == '1')
				{
					return;
				}

				$(".hotel_available").tipTip({ target: target, defaultPosition: "right", maxWidth: "338px", content: $('#hoverContent').html()
				});

				var selectedElementId = target.attr("id");
				var selectedHotelItem = "#h" + selectedElementId;

				$(selectedHotelItem).addClass("resultItemSelected");


				$("#hoverContent").css("position", "relative").css("z-index", "999");

				if(target.hasClass("priceLabel") || target.hasClass("markerDot")) {
					target = target.parent();
				}
				if (target.hasClass("hotel_available") || target.hasClass("hotel_availableHover"))
				{
					target.attr("class", "hotel_availableHover");
				}
				else if(target.hasClass("priceMarker") || target.hasClass("priceMarkerHover"))
				{
					target.attr("class", "priceMarkerHover");
				}
				else if(target.hasClass("aggregationMarker"))
				{
					target.attr("class", "aggregationMarkerHover");
				}
				else
				{
					target.attr("class", "hotel_unavailableActive");
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
				if(target.hasClass("priceLabel") || target.hasClass("markerDot")) {
					target = target.parent();
				}
				if (target.hasClass("hotel_available") || target.hasClass("hotel_availableHover"))
				{
					if (target.attr("clickbubble") != '1') {
						target.attr("class", "hotel_available");
					} else {
						target.attr("class","hotel_availableHover");
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
				else if(target.hasClass("aggregationMarker")  || target.hasClass("aggregationMarkerHover"))
				{
					target.attr("class", "aggregationMarker");
				}
				else if(target.hasClass("hotel_unavailable") || target.hasClass("hotel_unavailableActive") || target.hasClass("hotel_unavailableHover"))
				{
					if (target.attr("clickbubble") != '1') {
						target.attr("class", "hotel_unavailable");
					} else {
						target.attr("class","hotel_unavailableHover");
					}
				}

				var selectedElementId = target.attr("id");
				var selectedHotelItem = "#h" + selectedElementId;
				if (target.attr("clickbubble") == '1') {
					return;
				} else {
					//target.attr("class", "priceMarker");
					$(selectedHotelItem).removeClass("resultItemSelected");
				}
				hoverBox.setOptions({content: ""});

				map.events.addEventListener(aidep.dmap.Map.EVENT_CLICK, removeClickBubble);
			}
		}
	},

	function (map, item, content) {
		Content.transformLayerZIndex(map, item, content);
		var data = item.getData();
		filterHotel(data, content);
	});
	if(sessionStorage.getItem("userPrefsExist") == undefined && getURLParameter('query')== undefined)
	{
		centerToUS();
	}
	else{
		renderHotel( true );
	}
}

function removeClickBubble() {
	if ($("div[clickbubble='1']").length > 0) {
		$("div[clickbubble='1']").each(function () {
			$(this).removeAttr("clickbubble");
			if($(this).attr("class")=="hotel_unavailableActive"||$(this).attr("class")=="hotel_unavailable"||$(this).attr("class")=="hotel_unavailableHover")
				$(this).attr("class", "hotel_unavailable");
			else if($(this).attr("class")=="priceMarkerHover"||$(this).attr("class")=="priceMarker")
				$(this).attr("class", "priceMarker");
			else
			//$(this).attr("class", "priceMarker");
				$(this).attr("class", "hotel_available");
		});
	}
	deactive_click_tiptip();
}

function getHoverBox()
{
	return new Content(map, null, {
		style: {whiteSpace:'nowrap'},
		content:""
	});
	//var infobox = new SmartInfoWindow({position: marker.getPosition(), map: map, content: content});
	// return new SmartInfoWindow({position:null,map:map,content:""});

}

function init() {
	$('.resultsList').css('display','block');
	$('#GoogleMap').width($('.mapAndListContainer').width() - 312);
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
	if ( searchQuery != undefined )
	{
		$('#travelRequest').val( searchQuery );
	}

	var hotelNameFilter = getAndRemoveSessionStorageKey( "refineByHotelFilter" );
	if ( hotelNameFilter != undefined )
	{
		var hotelRefine = $('#hotelRefine');
		hotelRefine.val( hotelNameFilter );
		hotelRefine.keyup();
	}

	setUserPrefStarRating();
	setUserPrefSingleSelect( $('#sortList ul'), "selectedSortFilterIndex" );
}

function setUserPrefStarRating() {

	var selectedStarRatingId = getAndRemoveSessionStorageKey( "selectedStarRatingIndex" );
	var starRatingListElement = $( '#starRatingUl' );

	if ( selectedStarRatingId != undefined )
	{
		var selected = starRatingListElement.find( '#' + selectedStarRatingId );
		if ( selected.length <= 0 )
		{
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

	if ( singleSelectListElement != undefined )
	{
		setSingleSelect( singleSelectListElement, selectedId );
	}
}

function setSingleSelect(singleSelectListElement, selectedId) {

	if ( selectedId != undefined )
	{
		var selected = singleSelectListElement.find( '#' + selectedId );
		if ( selected.length > 0 )
		{
			selected.click();
		}
	}
	else
	{
		// If no user preference has been specified,
		// select the first list element as that is the default.
		var firstChild = singleSelectListElement.children('li').get(0);
		if(firstChild != undefined){
			firstChild.click();
		}

	}
}

function setUserPrefsMultiSelect(containerId, sessionStorageKey) {

	var value = getAndRemoveSessionStorageKey( sessionStorageKey );

	if ( value != undefined )
	{
		var ids = value.split( ',' );
		for (var i = 0; i < ids.length; i++)
		{
			var arr = ids[i].split( '#' );

			if ( arr.length == 1 )
			{
				var element = $( '#' + containerId ).find( '#' + arr[0] );
				if ( element.length > 0 )
				{
					element.click();
				}
			}
			else if ( arr.length == 2 )
			{
				// Add the extra filter
				addExtraFilter( containerId, arr[0], arr[1] );

				var element = $( '#' + containerId ).find( '#' + arr[0] );
				if ( element.length > 0 )
				{
					element.removeClass( 'on' );
					element.click();
				}
			}
		}
	}
}

// map loaded event,do jobs after map is idle.
function mapLoaded() {
	$("#loadmessagehtml").css("display", "none");
}


//Global variables
var globalJsonResponse;
var xmlHttp;
var keycode = '';
var e;
var serverPrefix="/";
var myData = [];
var oldvalue = '';
var oldQuery = '';
var gemmaServerData = null;
var lcmAmenityIdMappingData = null;
var first;

var infowin;
var bClose = false;
var triggerByItem = 0;

var isiPad = navigator.userAgent.match(/iPad/i) != null;

$(document).ready(function () {
	onPageReady();

	$('#GoogleMap').bind('click', function () {
		//closeInfoWindow();
		$("#travelRequest").autocomplete('close');
	});
	$(".ui-widget-header").hide();
	//allow show close button
	$(".ui-widget-content").css("overflow", "visible");
	//map height no scoller bar
	if($('#GoogleMap').length>0){
		init();
	}
	//console.log($('.filterBarContainer').outerHeight() );

	$('.mapAndListContainer').css("height",$(window).height() - $('#headerContainer').outerHeight() - $('.filterBarContainer').outerHeight());
	$('.mapAndListContainer').css('overflow','hidden');
	$('.mapcontainer').css('overflow','hidden');

	$(".searchsItem").live("mouseover", function () {
		if(isiPad || isStreetView)
		{
			return false;
		}
		var selectedElementId = $(this).attr('id').match(/\d+/g);
		var selectedMarker = document.getElementById(selectedElementId);
		simulate(selectedMarker, "mouseover");

		//if($("#" + selectedElementId).attr("class").toString().indexOf("priceMarker")>=0)
		//if($("#" + selectedElementId).hasClass("priceMarker"))
		if($("#" + selectedElementId).hasClass("hotel_available"))
			$("#" + selectedElementId).attr("class", "hotel_available");



	});
	$(".searchsItem").live("mouseout", function () {
		if(isiPad || isStreetView)
		{
			return false;
		}
		var selectedElementId = $(this).attr('id').match(/\d+/g);
		var selectedMarker = document.getElementById(selectedElementId);
		triggerByItem = 0;
		simulate(selectedMarker, "mouseout");
		if($("#" + selectedElementId).length>0)
		if ($("#" + selectedElementId).attr("class").indexOf("hotel_available") >= 0)
			$("#" + selectedElementId).attr("class", "hotel_available");
		if (($("#" + selectedElementId).attr("class")!=null && $("#" + selectedElementId).attr("class").indexOf("priceMarker") >= 0) && ($("#" + selectedElementId).attr("clickbubble") != '1'))
			$("#" + selectedElementId).attr("class", "priceMarker");
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

	$(".hoverBtn").live("click", function (event) {
		event.stopPropagation();
		var selectedElementId = $(this).parent().attr('id').match(/\d+/g);
		//console.log('hover click......' + selectedElementId);
		hoteldetails(selectedElementId);
	});

	$(document).keyup(function (e) {
		if(e.which == 17) isCtrl=false;
		if(e.which == 18) isAlt= false;
		if($('#introduction').css('display')!='none'){
			$('#introduction').dialog('close');
		}
        //$('#introduction').hide();
	}).keydown(function (e) {
		if(e.which == 17) isCtrl=true;
		if(e.which == 18) isAlt=true;
		if(e.which == 73 && isCtrl == true && isAlt == true) {
			//run code for CTRL+S -- ie, save!
			openParseWindow();
		}
	});

	setTravelRequestWidth();
	$("#travelRequest").focus();
	setUserPrefs();
});

window.onload = function(){

	$('#travelRequest').focus();

	var userPrefsExist = getAndRemoveSessionStorageKey( "userPrefsExist" );
	if ( userPrefsExist != undefined && window.map != undefined )
	{
		renderHotel( true );
	}

	checkIntroduction();
};

$(window).resize(function () {
	$('.mapAndListContainer').css('top','0px');
	$('.mapAndListContainer').css("height",$(window).height() - $('#headerContainer').outerHeight() -  $('.filterBarContainer').outerHeight());
	//$('.resultsList').css("height",$(window).height() - $('#headerContainer').outerHeight());
	//$('.resultsListBk').css("height",$(window).height() - $('#headerContainer').outerHeight());
	setTravelRequestWidth();

	$("#parsePopup").dialog("option", "position", "center");
	$("#introduction").dialog("option", "position", getIntroPosition());

	//console.log($('#introduction').css('display'));
	//console.log($('#introduction').parent().hasClass('ui-dialog'));
	$('.ui-dialog #introduction').parent().css('top',getIntroPosition()[1]);
	//console.log('resize...');
	if($('#GoogleMap').length>0){
		addHotelToList();
	}

	$('#GoogleMap').css('width',$('#headerContainer').width() - 312);

});

function updateMapConfig(){
	map.config.height = parseInt($("#GoogleMap").height()) - 50;
	map.config.width = parseInt($("#GoogleMap").width()) - 50;
}

function fixInfoWindow() {
	var proto = google.maps.InfoWindow.prototype,

	open = proto.open;
	proto.open = function (map, anchor, please) {
		if (please) {
			return open.apply(this, arguments);
		}
	}
}



//store the olde value of query input
function getOldValue() {
	var prefix = $("#travelRequest").val();
	oldvalue = prefix;
}
function getOldQuery() {
	if(oldQuery ==''){
		return $("#travelRequest").val();
	}else{
		return oldQuery;
	}
}
$.extend($.ui.dialog.overlay.prototype, {
	destroy: function () {
	}
});

function getPriceRange(){
	var currencyCode = getCurrencyCode();

	$.getJSON('priceRange?currencyCode=' + currencyCode,function(data) {

		$('#priceListUl li:not(:first)').remove();
		for(var idx in data)
		{
			$('#priceListUl').append('<li id="'+idx+'"><label>'+ data[idx] +'</label><span count="0">(0)</span></li>');
		}

		setUserPrefSingleSelect( $('#priceListUl'), "selectedPriceFilterIndex" );
	});
}

function getGemmaServerData(){
	$.getJSON('gemmaServerData',function(data){
		gemmaServerData = data;
		getGemmaVersionProcess();
	});
}

function getLcmAmenityIdMappings(){

	$.getJSON('lcmAmenityIdMappingData',function(data){

		lcmAmenityIdMappingData = data;

		// The LcmAmenityIdMappings are required before a click can be triggered on the amenity list
		setUserPrefsMultiSelect( "amenitiesList", "selectedAmenities" );
		setUserPrefsMultiSelect( "themesList", "selectedThemes" );
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
	$("#parsePopup").dialog({
		modal: true,
		width: 800,
		height: 400,
		zIndex: 992,
		resizable: false,
		autoOpen: true,
		title: 'Parse Tree',
		draggable: false,
		open: function () {
			$('.ui-widget-overlay').animate({ opacity: 0.8 }, 300);
			$('.ui-dialog-buttonpane').find('button:contains("Send")').addClass("btn-send");
			$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass("btn-close");
			$('.ui-dialog-titlebar-close').removeClass('ui-dialog-titlebar-close').addClass('close-icon').html('X').unbind('hover').css('textDecoration','none').css('color','#222');
			setTimeout(function(){
				$(document).unbind('mousedown.dialog-overlay')
                .unbind('mouseup.dialog-overlay');
			},200);
		},

		beforeClose: function (event, ui) {
			$('.ui-widget-overlay').animate({ opacity: 0 }, 300).hide(300);
			$(document).unbind($.ui.dialog.overlay.events);
			},
		show: { effect: "fade", duration: 300 },
		hide: { effect: "fade", duration: 300 }
	}).dialog('open');
	isCtrl = false;
	isAlt = false;

}

function closeInfoWindow()
{
	if(!bClose)
	{
		bClose=true;
	}
}

//get from gemma
function getData() {
	//console.log('getData.....');
	var code;
	if (!e) e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;

	// closeInfoWindow();
	if (code == 13) {
		//console.log('Enter....');

		var eventTrigger = 'SearchBoxEnter';
		var searchType= 'Manual';
		if(autoCompleteSelected){
			eventTrigger = 'SearchBoxSuggestionSelectThenEnter';
			searchType = 'Autosuggest';
		}

		//console.log(searchType + ':' + eventTrigger);
		createTravelRequest(searchType, eventTrigger);
		$("#travelRequest").autocomplete('close');
	}

	keycode = String.fromCharCode(code);
	if (keycode.length == 0) return myData;
	var prefix = escape($("#travelRequest").val());
	if (prefix.length == 0) return myData;

	var autoUrl = serverPrefix + "sphinx/AutoSuggestService?travelRequest=" + prefix;
	oldQuery = escape($("#travelRequest").val());
	if(serverData==null){
		getServerData("Manual", "SearchBoxEnter", true);
		return;
	}
	if(lcmAmenityIdMappingData==null){
		getLcmAmenityIdMappings();
	}
	if(gemmaServerData==null){
		getGemmaServerData();
	}
	if (!$.browser.msie||window.XDomainRequest)
		autoUrl =  gemmaServerData.gemmaURL + "&prefix=" + prefix;
	if (!window.XDomainRequest) {
		$.ajax({
			url: autoUrl,
			dataType: "xml",
			success: parsexml,
			complete: setupAC,
			error: function (jqXHR, textStatus, errorThrown) {

			}

		});
	}
	else {
		var xdr = new XDomainRequest();
		xdr.open("get", autoUrl);
		xdr.onload = function () {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = false;
			try {
				doc.loadXML(xdr.responseText);
				// alert("Got: " + xdr.responseText);
			} catch (e) {
				doc = undefined;
			}
			if (doc != undefined) {
				parsexml(doc);
				setupAC();
			}

		}
		xdr.send();
	}
}

function getGemmaVersion(){
	//console.log('getGemmaVersion');
	var autoUrl =  gemmaServerData.gemmaURL + "&prefix=v";
	if (!window.XDomainRequest) {
		$.ajax({
			url: autoUrl,
			dataType: "xml",
			success: getVersion,
			complete: function(){},
			error: function (jqXHR, textStatus, errorThrown) {

			}

		});
	}
	else {
		var xdr = new XDomainRequest();
		xdr.open("get", autoUrl);
		xdr.onload = function () {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = false;
			try {
				doc.loadXML(xdr.responseText);
				// alert("Got: " + xdr.responseText);
			} catch (e) {
				doc = undefined;
			}
			if (doc != undefined) {
				getVersion(doc);
			}

		}
		xdr.send();
	}

	function getVersion(xmlResponse){
		var gemmaVersion = $("GemmaSuggestResponse ", xmlResponse).attr('productVersion');
		$('#gemmaVersion').text(gemmaVersion);
		//console.log('gemmaVersion: ' + gemmaVersion);
	}
}

//parse auto suggestion xml response
function parsexml(xmlResponse) {
	myData = $("Suggestion", xmlResponse).map(function () {
		return {
			value: $(this).text(),
			id: $(this).text()
		};
	}).get();
}

//setup auto complete control
function setupAC() {
	$("#travelRequest").autocomplete({
		source: myData,
		dataType: "xml",
		open: function(event, ui) {  },
		select: function(event, ui) {
			autoCompleteSelected = true;
			$("#travelRequest").val(ui.item.value);
			createTravelRequest('Autosuggest', 'SearchBoxSuggestionClick'); }
	});

	var prefix = escape($("#travelRequest").val());


	if (oldvalue != prefix) {
		//if (!window.XDomainRequest)
			//$("#travelRequest").keyup += getData();
		oldvalue = prefix;
	}


}

var createTravelRequestHandler = null;
function createTravelRequest(searchType, eventTrigger) {

	if(createTravelRequestHandler!=null){
		clearTimeout(createTravelRequestHandler);
	}

	requestTime=0;
	createTravelRequestHandler = setTimeout(function(){createTravelRequestHandle(searchType, eventTrigger);},500);
}

function createTravelRequestHandle(searchType, eventTrigger) {
    //console.log('createTravelRequest:' + searchType);
	//console.log('room info:' + roomFilter);
	isHotelDetail=false;
	clearAmentityFilter();

	var dpFromDate = getURLParameter('arrivalDate');
	var dpToDate = getURLParameter('departureDate');
	var roomDetails = getURLParameter('roomdetails');

	//console.log('dpFromDate: ' + dpFromDate);
	//console.log('dpTo: ' + dpToDate);

	if(window.location.href.indexOf("hoteldetail")>0){
		var dest = "hotelfinder?query=" + $('#travelRequest').val();
		if(dpFromDate!=''&&dpFromDate!=undefined){
			dest += '&arrivalDate=' +dpFromDate;
		}
		if(dpToDate!=''&&dpToDate!=undefined){
			dest += '&departureDate=' +dpToDate;
		}
		if(roomDetails!=''&&roomDetails!=undefined){
			dest += '&roomdetails=' +roomDetails;
		}
		//console.log('Dest:' + dest);
		//return;
		window.location.href= dest;
	}

	var googleMapVisible = $('#GoogleMap').css('display');
	$('body').css({'overflow-x':'auto','overflow-y':'hidden'});

	if(googleMapVisible=='none'){
		//console.log('show process');
		$('#GoogleMap').show();
		$('#filterContainer').show();
		$('#headerContainer ').addClass('absoluteHeader');
		$('.pageContainer').hide();

		init();
	}
	$("#loadmessagehtml").css("display","block");
	$("#searchMsg").text("");
	var queryPrefix = serverPrefix +Semantha.NLPServicePrefix;
	userQuery = document.getElementById('travelRequest').value;
	var encodedUserQuery = escape(userQuery);
	var queryURL = queryPrefix + encodedUserQuery;
	var start = new Date().getTime();
	deactive_tiptip();
	if(userQuery.indexOf(addressPrefix) == 0) {
		zoomExplicitily = true;
		var address = userQuery.substr(addressPrefix.length);
		renderNLPMap(address, addressZoomLevel);
		var destination = '<span id="hotelDest">' + address + '</span>';
		var understoodText = 'hotels in ' + address;
		var feedback = "We understood: hotels in " + destination + "<span class='backer'></span><span class='opponent'></span>";
		$("#searchMsg").html(feedback);
		$(".backer").votingPop({askedForTxt:$("#travelRequest").val(),understoodTxt:understoodText,vote:'Up',parseQuery:''});
		$(".opponent").votingPop({askedForTxt:$("#travelRequest").val(),understoodTxt:understoodText,vote:'Down',parseQuery:''});

		mapLoaded();
		sendCaptureRequest(searchType, eventTrigger);
	}
	else {
		zoomExplicitily = false;
	$.ajax({
		type: "GET",
		url: queryURL,
		dataType: "xml",
		success: function (result) {
			// get hotelnames and ids from NLP Parse Tree
			var hotels = getHotels(result);
			nlpHotelIds = hotels.ids;
			nlpHotelNames = hotels.names;
			var location;
			if(nlpHotelIds.length == 0)
			{
				location = getLocation(result);
			}
			else
			{
				// some placeholder to use for displaying the right 'nlp understood text'
				location = "hotels";
			}
			var dates = getDates(result);
			LoadXMLDom('parseContent', result);
			if (location=="error") {
				var errorMsg = getErrorMsg();
				$("#searchMsg").text(errorMsg);
				$("#parseTreeArea").css("display", "none");
				mapLoaded();
                sendCaptureNLPFeedback('', encodedUserQuery, 'Down', 'UserQueryNotUnderstood', 'SystemVote', errorMsg);
				return;
			}

			var nlpParseResult;
			if (!location || location.length == 0) {
				location = "the world";
				nlpParseResult = parseNLP(result, location, true);
			}
			else {
				nlpParseResult = parseNLP(result, location, false);
			}
			//console.log(nlpParseResult);
			if(nlpParseResult['nonHotelQuery'] != null){
				var errorMsg = "We understood: I'm sorry, Semantha BEST doesn't support searching for "
					+ nlpParseResult['nonHotelQuery'] +" at this time.";
				$("#searchMsg").text(errorMsg);
				return;
			}
			$xml = $(result);
			$("#parseTreeArea").css("display", "block");
			var diff = new Date(new Date().getTime() - start);
			var showtext = 'Parsed in ' + diff.getMilliseconds() + ' milliseconds';
			$("#lblTimeUsed").text(showtext);

			mapLoaded();
			//Adding dates to datepicker only if nlp recognizes events
			if(dates)
			if(dates[0] != '' && dates[1] != '')
			{
				addDatesToDatePicker(dates);
			}
			//we don't have star and brand pannel anymore so comment these line
			//addStarFilter();
			//addBrandFilter();
			//addAmenityFilter();

			// Render map based on nlphotelids if they were retrieved from NLP Parse tree
			// Location through hotel ids takes precedence over that through destination
			if(nlpHotelIds.length == 0)
			{
				renderNLPMap(location, nlpParseResult['zoomLevel']);
			}
			else
			{
				// nlp location is being used to render the same viewport for concurrent searches in the same location
				// Resetting this to ensure that a search by hotel name followed by a search by location will result in change of viewport.
				// If this is not reset, the search by location will think that you are already in the previous location parsed and will not update viewport.
				nlpLocation = "";
				renderMapUsingHotelIds(nlpHotelIds);
			}
			sendCaptureRequest(searchType, eventTrigger);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			mapLoaded();
			$("#searchMsg").text(getErrorMsg());
			//alert("Error: this query pattern is not supported yet!");
		}
	});
	}
	setTimeout(function () {
			$("#travelRequest").autocomplete('close');
			autoCompleteSelected = false;
		}, 800);

}
//Get hotel ids and names from the NLP Parse tree
function getHotels(NLPResponse) {
	var hotelIds = [];
	var hotelNames = [];
	if (!window.ActiveXObject||parseInt($.browser.version)>=10) {
		//alert('Not ie');
		var faultCodes=$("ParseFaultList ParseFault FaultCode", NLPResponse).map(function(){
			return {
				value:$(this).text()
			};
		}).get();
		if(!faultCodes[0])
		{
			$xml = $(NLPResponse);
			var xmlDoc;
			NLPResponse = $((new XMLSerializer()).serializeToString($xml.find("Parselist Parse")[0]));
			var hotelIdsParsed = $("Hotel HotelNameList DomainValue DomainList Domain", NLPResponse).map(function () {
				return {
					value: $(this).attr("id")
				};
			}).get();
			var hotelNamesParsed = $("Hotel HotelNameList DomainValue DomainList Domain", NLPResponse).map(function () {
				return {
					value: $(this).attr("name")
				};
			}).get();
			if (hotelIdsParsed[0])
			{
				for (var i = 0; i < hotelIdsParsed.length; i++)
				{
   					hotelIds.push(hotelIdsParsed[i].value);
   					hotelNames.push(hotelNamesParsed[i].value);
    			}
			}
    	}
	}
	else {
		var firstParse = NLPResponse.selectNodes("//ParseList/Parse")[0];
		if(firstParse !=null){
			var nodes = firstParse.selectNodes("Hotel/HotelNameList/DomainValue/DomainList/Domain")
			for(var i = 0; i< nodes.length; i++)
			{
				hotelIds.push(nodes[i].getAttribute("id"));
				hotelNames.push(nodes[i].getAttribute("name"));
			}
		}

	}
	return {
	  	ids: hotelIds,
    	names: hotelNames
   	};
}

function renderMapUsingHotelIds(hotelids)
{
	// For a given set of hotelids, get the latlong pairs from EAN and fit the map to its corresponding bounds
	mapViewChangedCount = 0;
	itemsvcHotel.clearItemsRequests();
	fitBounds(hotelids);

	itemsvcHotel.makeRequests();

}

function fitBounds(hotelids)
{
	var latlongs = [];
	for(var idx=0; idx<hotelids.length; idx++)
	{
		// Backend servlet which returns back a latlong pair for a given hotelid
		var hotelLocatorURL = "hotellocator?hotelid=" + hotelids[idx];
		$.ajax({
			async: false,
			url: hotelLocatorURL,
			success: function (data){
				if(data && data.Latitude && data.Longitude){
					latlongs.push(new aidep.dmap.LatLong(data.Latitude, data.Longitude));
				}},
			error: function(data){
				// do nothing
				}
			});
	}
	if(latlongs.length == 0)
	{
		//If no latlongs can be fetched for hotels, default to center of US
		//Also reset nlpHotelIds to not send them as filters in the dmaps call
		nlpHotelIds = [];
		nlpHotelNames = [];
		//var center=new aidep.dmap.LatLong(34.099406047644386,-93.23253935761407);
		//map.setCenter(center);
		//map.setZoom(5);
		centerToUS();
	}
	else if(latlongs.length == 1)
	{
		// If there is only one lat long to fit, use it as center with a fixed zoom level to avoid streel level zoom.
		var center=new aidep.dmap.LatLong(latlongs[0].getLat(),latlongs[0].getLong());
		map.setCenter(center);
		map.setZoom(15);
	}
	else
	{
		var bounds = aidep.dmap.Bounds.fromLatLongs(latlongs);
		map.fitBounds(bounds);
	}

}

function updateViewport(location, zoomLevel) {
	//console.log('renderMap');
	// keeping geocoder out of aidep.dmap.google.Map since its not coupled with the map implementation, we only get bounds for a given location.
	var geocoder = new google.maps.Geocoder();

	var searchLocation=location.replace(/\(All\)|\(and Vicinity\)|\(region\)|\(province\)|\(all\)/i,"");
	var result=null;
	var rspCount=0;
	var searches;
	var split=/([^-]*) - ([^,]*)(,.*)?/.exec(searchLocation);
	if(split) {
		// handle combined locations (St. Petersburg - Clearwater, FL) by asking for both and merging them
		if(split[3]==null)
			split[3]="";
		searches=[split[1]+split[3],split[2]+split[3]];
	} else {
		searches=[searchLocation];
	}
	var callback=function(results,status) {
		rspCount++;
		if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
			var viewport=results[0].geometry.viewport;
			if(!disjoint(ZOOM_LOCATION_TYPES, results[0].types)) {
				// zoom out one level
				results[0].geometry.viewport=viewport=scaleViewport(viewport,2);
			}
			var distance=google.maps.geometry.spherical.computeDistanceBetween(viewport.getNorthEast(),viewport.getSouthWest());
			if(2000 > distance) { // scale to a minimum of 2 km
				results[0].geometry.viewport=viewport=scaleViewport(viewport,2000/distance);
			}

			if(result == null) {
				result = results[0];
			} else {
				result.geometry.viewport=viewport=result.geometry.viewport.union(viewport);
				// reset center since this isn't a real location
				result.geometry.location=result.geometry.viewport.getCenter();
			}

			if(rspCount < searches.length)
				return;

			var ne=viewport.getNorthEast(), sw=viewport.getSouthWest();
			map.fitBounds(
					new aidep.dmap.Bounds(
							new aidep.dmap.LatLong(ne.lat(),ne.lng()),
							new aidep.dmap.LatLong(sw.lat(),sw.lng())));

			// set to specific zoom level (address, event, etc).
			if(zoomLevel)
			{
				zoomExplicitily = true;
				map.setZoom(zoomLevel);
			}
		} else {
			document.title = getLocalizedString('hotel-finder.map-failure');
		}

	}

	for(var i=0;i<searches.length;i++)
		geocoder.geocode({'address':searches[i]}, callback);
}

function scaleViewport(viewport,scale) {
	var spherical=google.maps.geometry.spherical;
	var ne=viewport.getNorthEast(), sw=viewport.getSouthWest();
	var distance=spherical.computeDistanceBetween(ne,sw);
	distance=(distance*scale-distance)/2;// compute the offset NE and SW.
	return new google.maps.LatLngBounds(
				spherical.computeOffset(sw,distance,180+45),
				spherical.computeOffset(ne,distance,45)
			);
}

function disjoint(rg1,rg2) {
	for(var i=0;i<rg1.length;i++) {
		for(var j=0;j<rg2.length;j++) {
			if(rg1[i]==rg2[j])
				return false;
		}
	}
	return true;
}

//parse nlp result
function renderNLPMap(location, zoomLevel)
{
	//console.log('renderNLPMap');

	$(".resultsListBk").css("display","block");
	$(".resultsList").css("display","block");
	var useCurrentViewport = (nlpLocation == location);
	nlpLocation = location;

	if(location=="the world")
	{
		mapViewChangedCount = 0;
		centerToUS();
	}
	else if(useCurrentViewport)
	{
		if(mapViewChangedCount >2 ){
			wrapLocation();
		}

		renderHotel(true);
	}
	else
	{
		mapViewChangedCount = 0;
		updateViewport(location, zoomLevel);
	}
}

function centerToUS(){
	//var center=new aidep.dmap.LatLong(34.099406047644386,-93.23253935761407);
	//map.setCenter(center);
	//map.setZoom(2);
	boundsBasedZoom(65.02,122.34,-40.53,-130.78);
	itemsvcHotel.makeRequests();
	itemsvcHotel.clearItemsRequests();
}


function wrapLocation(){
	//console.log('wrapLocation');
	if(!$('#hotelDest').parent().is('span')){

		$('#hotelDest').wrap('<span class="locationLink" title="Move the map to ' + $('#hotelDest').text() + '" onclick="resetLocation()"/>');
	}
}

function resetLocation(){
	//console.log($('#hotelDest').attr('hotelIds'));
	mapViewChangedCount = 0;
	if($('#hotelDest').attr('hotelIds') != null){
		nlpLocation = "";
		renderMapUsingHotelIds([$('#hotelDest').attr('hotelIds')]);
	}else if(nlpLocation == 'the world'){
		centerToUS();
	}else{
		if(zoomExplicitily){
			updateViewport(nlpLocation,addressZoomLevel);
		}else{
			updateViewport(nlpLocation);
		}

	}

	if($('#hotelDest').parent().is('span')){
		$('#hotelDest').unwrap();
	}
}


function getAmenityIdByName(amenityName) {
	var ids = [];
	if (!window.ActiveXObject||parseInt($.browser.version)>=10) {
		$(nlpXmlData).find('AmenityList DomainValue').each(function () {
			//console.log(this);
			if ($(this)[0].childNodes[0].firstChild.data == amenityName) {
				for (var i = 0; i < $(this)[0].childNodes[1].childNodes.length; i++) {
					//$(this).childNodes[0].childNodes[1].childNodes[i].attributes["id"].value
					ids.push($(this)[0].childNodes[1].childNodes[i].attributes["id"].value);
				}
			}

		});
	}
	else {
		var nodes = nlpXmlData.selectNodes('/NLPParseResponse/ParseList/Parse/Hotel/AmenityList/DomainValue[Text/text()="'+amenityName+'"]/DomainList/Domain');
		if (nodes.length > 0) {
			for (j = 0; j < nodes.length; j++) {
				ids.push(nodes[j].attributes.getNamedItem("id").value);
			}
		}
	}
	return ids;
}

/**
 * Parse NLP response and return a specific map zoom level or null (use the default zoom level).
 */
function parseNLP(data,destination,unknowlocation) {
	var parseResult = {};
	nlpXmlData = data;
	nlpPrice ={};
	nlpHotelName = '';
	var star = "", brand = "", amenity = "", nlpEvent = null, theme = "", isExact = false;
	nlpbrand = "";
	nlpBrandIds.length=0;
	var hotelNameBySearch = null, hotelIdsBySearch=null;
	var sa = new SemenathaAttr();
	$xml = $(data);
	var xmlDoc;
	if(!window.ActiveXObject||parseInt($.browser.version)>=10)
		$xml = $((new XMLSerializer()).serializeToString($xml.find("Parselist Parse")[0]));
	else
		{
		var firstParse=data.selectNodes("//ParseList/Parse")[0];
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(firstParse.xml);

		}

	//if not ie
	if (!window.ActiveXObject||parseInt($.browser.version)>=10)
	{
		for(var idx in nonHotelArray){
			var nonHotelTag = $xml.find(nonHotelArray[idx]);
			if ( nonHotelTag!= undefined && nonHotelTag.length >0){
				//console.log($xml.find(nonHotelArray[idx]));
				parseResult['nonHotelQuery'] = nonHotelArray[idx].toLowerCase() + 's';
				return parseResult;
			};
		}

		//console.log('parse tree');
		if ($xml.find("Domain[type='StarRating']").attr("id") != undefined){
			//console.log('star...');
			nlpStar = $xml.find("Domain[type='StarRating']").attr("id");
			addNewStarRatingListFilterGivenRating(nlpStar);
		}
		else
			nlpStar = 0;
		nlpStarMin = nlpStarMax = nlpStar;

		if ($xml.find("StarRating Min Text") != undefined)
			star = $xml.find("StarRating Min Text").first().text() + " ";

		if($xml.find("ProximityList Proximity DomainList Domain[id='EXACT']").length>0)
		{
			isExact=true;
		}

		$xml.find("BrandList DomainValue Domain").map(function()
		{
					//DM ids and group name
				    nlpBrandIds.push($(this).attr("id"));
		});

		if ($xml.find("BrandList DomainValue Domain") != undefined)

			if ($xml.find("BrandList DomainValue Domain").attr("name"))
			{
				brand = $xml.find("BrandList DomainValue Domain").attr("name");
				nlpbrand = brand;
			}
			else
			{
				nlpbrand = '';
			}
			if ($xml.find("Domain[name='SemanthaBrand']").attr("name"))
			{
				brand = $xml.find("Domain[name='SemanthaBrand']").attr("name");
				nlpbrand = brand;
			}


		amenity = "";
		nlpAmenities.length = 0;

		nlpAmenityIds.length = 0;
		$xml.find("Domain[type='SemanthaAttr']").map(function()
				{
					//DM ids and group name
				    nlpAmenityIds.push($(this).attr("id"));
				    nlpAmenities.push($(this).attr("name"));
                    if(sa.getCategory($(this).attr("id"))=="Theme")
                    {
                    	theme=theme+$(this).attr("name")+" ";
                    	if(isExtraFilter($(this).attr("id"))){
                        	//console.log('isExtraFilter');
                        	addExtraFilter('themesList',$(this).attr("id"),$(this).attr("name"));
                        }else{
                        	selectAmenityFilter($(this).attr("id"));

                        }
                    }
                    else
                    {
                    	amenity = amenity.amenityAdd($(this).attr("name")) + " and ";
                    	if(isExtraFilter($(this).attr("id"))){
                        	//console.log('isExtraFilter');
                        	addExtraFilter('amenitiesList',$(this).attr("id"),$(this).attr("name"));
                        }else{
                        	selectAmenityFilter($(this).attr("id"));

                        }
                    }




				});

		$xml.find("Domain[type='ActivityName']").map(function()
				{
					//DM ids and group name
				    nlpAmenityIds.push($(this).attr("id"));
				    nlpAmenities.push($(this).attr("name"));

                    theme=theme+$(this).attr("name")+" ";
                    if(isExtraFilter($(this).attr("id"))){
                        	//console.log('isExtraFilter');
                    addExtraFilter('themesList',$(this).attr("id"),$(this).attr("name"));
                     }else{
                       selectAmenityFilter($(this).attr("id"));
                     }
				});
		/*if ($xml.find("AttributeList DomainValue Text").length > 0) {

			$xml.find("AttributeList DomainValue Text").each(function () {
				amenity = amenity.amenityAdd($(this).text()) + " and ";
				nlpAmenities.push($(this).text());
			});

		}*/
		amenity=amenity.substr(0,amenity.length-5);
		theme=theme.substr(0,theme.length-1);
		$xml.find("TimeRange Specific Start Value").each(function () {
			var startTime = $(this).text();
			//console.log('data' + startTime.substr(0,10));
			//$('#dpfrom').val(dateFormatTransfer(startTime.substr(0,10)));
			$("#dpfrom").datepicker("setDate",dateFormatTransfer(startTime.substr(0,10)));


		});


		$xml.find("Domain[type='LCMHotelName']").each(function () {
			hotelNameBySearch = $(this).attr('name');
			hotelIdsBySearch = $(this).attr('id');

		});

		$xml.find("TimeRange Specific End Value").each(function () {
			//console.log('data' + $(this).text());
			var endTime = $(this).text();
			//console.log('data' + endTime.substr(0,10));
			//$('#dpto').val(dateFormatTransfer(endTime.substr(0,10)));
			$("#dpto").datepicker("setDate",dateFormatTransfer(endTime.substr(0,10)));

		});

		$xml.find("EventList Event DomainValue Text").each(function () {
			//console.log('data' + $(this).text());
			nlpEvent = {};
			nlpEvent.text = $(this).text();
			nlpEvent.location = $xml.find("EventList Event DestinationList Domain").attr('name')

		});

		$xml.find("EventList Event TimeRange Start Value").each(function () {
			//console.log('data' + $(this).text());
			if(nlpEvent!=null){
				nlpEvent.startTime = $(this).text();
			}

		});

		$xml.find("EventList Event TimeRange End Value").each(function () {
			//console.log('data' + $(this).text());
			if(nlpEvent!=null){
				nlpEvent.endTime = $(this).text();
			}

		});




		//console.log(nlpStarMin + ':' +nlpStarMin );
	}
	else
	{
		for(var idx in nonHotelArray){
			var nonHotelTag = xmlDoc.selectNodes('//' + nonHotelArray[idx]);
			//var nonHotelTag = $xml.find(nonHotelArray[idx]);
			if ( nonHotelTag.length >0){
				//console.log(nonHotelTag);
				parseResult['nonHotelQuery'] = nonHotelArray[idx].toLowerCase() + 's';
				return parseResult;
			};
		}

		var nodes = xmlDoc.selectNodes("//Domain[@type='StarRating']");
		if (nodes.length > 0) {
			nlpStar = nodes[0].attributes.getNamedItem("id").value;

			addNewStarRatingListFilterGivenRating(nlpStar);
		}
		else
			nlpStar = 0;
		nlpStarMin = nlpStarMax = nlpStar;
		nodes = xmlDoc.selectNodes("//ProximityList//Proximity//DomainList//Domain[@id='EXACT']");
		if(nodes.length>0)
			isExact=true;

		nodes = xmlDoc.selectNodes("//StarRating/Min/Text");
		if (nodes.length > 0)
			star = nodes[0].childNodes[0].nodeValue;

		nodes = xmlDoc.selectNodes("//BrandList//DomainValue//DomainList//Domain");
		for(var j=0;j<nodes.length;j++)
		{
			nlpBrandIds.push(nodes[j].getAttribute("id"));
		}

		nodes = xmlDoc.selectNodes("//Domain[@type='LCMBrand']");
		if (nodes.length > 0) {
		    brand = nodes[0].getAttribute("name");
		    nlpbrand = brand; //nlpbrand is parameter into dmap while brand is text show on feedback lable.
		}else{
			nlpbrand = '';
		}

		nodes = xmlDoc.selectNodes("//Domain[@type='SemanthaBrand']");
		if (nodes.length > 0) {
		    brand = nodes[0].getAttribute("name");
		    nlpbrand = brand; //nlpbrand is parameter into dmap while brand is text show on feedback lable.
		}


		nodes = xmlDoc.selectNodes("//Domain[@type='LCMHotelName']");
		if (nodes.length > 0) {
			hotelNameBySearch = nodes[0].getAttribute("name");
			hotelIdsBySearch = nodes[0].getAttribute("id");
		}


		nodes = xmlDoc.selectNodes("//Domain[@type='SemanthaAttr']");
		nlpAmenityIds.length=0;
		nlpAmenities.length=0;
		if(nodes.length>0)
		{

			for(var j=0;j<nodes.length;j++)
				{
					nlpAmenityIds.push(nodes[j].getAttribute("id"));
				    nlpAmenities.push(nodes[j].getAttribute("name"));
		            if(sa.getCategory(nodes[j].getAttribute("id"))=="Theme")
		            {
		            	theme=theme+nodes[j].getAttribute("name")+" ";
		            	if(isExtraFilter(nodes[j].getAttribute("id"))){
		                    addExtraFilter("themesList",nodes[j].getAttribute("id"),nodes[j].getAttribute("name"));
		                  }else{
		                	  selectAmenityFilter(nodes[j].getAttribute("id"));
		                  }
		            }
		            else
		            {
		            	amenity = amenity.amenityAdd(nodes[j].getAttribute("name")) + " and ";
		            	 if(isExtraFilter(nodes[j].getAttribute("id"))){
		                    addExtraFilter("amenitiesList",nodes[j].getAttribute("id"),nodes[j].getAttribute("name"));
		                  }else{
		                	  selectAmenityFilter(nodes[j].getAttribute("id"));
		                  }
		            }


				}

		}

		nodes = xmlDoc.selectNodes("//Domain[@type='ActivityName']");
		if(nodes.length>0)
		{

			for(var j=0;j<nodes.length;j++)
				{
					nlpAmenityIds.push(nodes[j].getAttribute("id"));
				    nlpAmenities.push(nodes[j].getAttribute("name"));
		            theme=theme+nodes[j].getAttribute("name")+" ";
		            if(isExtraFilter(nodes[j].getAttribute("id"))){
		                 addExtraFilter("themesList",nodes[j].getAttribute("id"),nodes[j].getAttribute("name"));
		            }else{
		                 selectAmenityFilter(nodes[j].getAttribute("id"));
		            }
				}

		}

		amenity=amenity.substr(0,amenity.length-5);
		theme=theme.substr(0,theme.length-1);

		nodes = xmlDoc.selectNodes("//TimeRange/Specific/Start/Value");
		if(nodes.length>0){
			$("#dpfrom").datepicker("setDate",dateFormatTransfer(nodes[0].text.substr(0,10)));
		}

		nodes = xmlDoc.selectNodes("//TimeRange/Specific/End/Value");
		if(nodes.length>0){
			$("#dpto").datepicker("setDate",dateFormatTransfer(nodes[0].text.substr(0,10)));
		}

		//console.log('data' + nodes);

		//console.log(nlpStarMin + ':' +nlpStarMin );
	}
    //$('#dpfrom').val('03/13/2013');
    //$('#dpto').val('03/14/2013');
	var sb=new StringBuilder();

	//alert(star);
	if(star.length>0)
		sb.append(star+ " ");

	if (brand.length > 0)
    {
        if(theme.length==0)
		sb.append(brand.replace(/( hotels)/ig,"")+" hotels ");
        else
        sb.append(theme+" "+brand.replace(/( hotels)/ig,"")+" hotels ");
    }
	else
    {

       if(theme.length==0)
		sb.append("hotels ");
       else
       {
         sb.append(theme+" hotels ");

       }
    }
	updateAmenityLabel();
	if(amenity.length>0)
		sb.append("with "+amenity+" ");


	if(destination.length>0){
		destination = '<span id="hotelDest">' + destination + '</span>';
		if(isExact==false){
			sb.append("around " + destination);
		}else if(isExact==true){
			sb.append("in " + destination);
		}
	}
	var feedback = "";
	var parseQuery = "";
	if (!unknowlocation && destination != "hotels") {
		//console.log('Event: ' + nlpEvent.text + ":" + nlpEvent.endTime );
		// Bumbershoot is Aug 30 - Sep 3 at Seattle Center, Seattle, WA. Here are some hotels around there
		if(nlpEvent!=null){
			sb = new StringBuilder();
			sb.append(nlpEvent.text);
			sb.append(' is on ');
			sb.append(eventTimeParse(nlpEvent.startTime,nlpEvent.endTime));
			sb.append(' at ');
			sb.append(nlpEvent.location);
			sb.append('. Here are some hotels around there.');
			//console.log('Event: ' + sb.toString());
		}
		parseQuery = sb.toString();
		//alert(parseQuery);
		if(hotelNameBySearch != null){
			sb = new StringBuilder();
			sb.append('<span id="hotelDest" hotelIds="' + hotelIdsBySearch +'">' + hotelNameBySearch + '</span>');
			feedback = "We understood: " + sb.toString() + "<span class='backer'></span><span class='opponent'></span>";

		}else{
			feedback = "We understood: " + sb.toString() + "<span class='backer'></span><span class='opponent'></span>";
		}

	}
	else if(destination == "hotels"){
		sb = new StringBuilder();
		var uniqueHotelNames = [];
		$.each(nlpHotelNames, function(i, el){
    		if($.inArray(el, uniqueHotelNames) === -1) uniqueHotelNames.push(el);
		});
		sb.append(uniqueHotelNames.toString());
		feedback = "Here is " + sb.toString() + "."  + "<span class='backer'></span><span class='opponent'></span>";
	}
	else {
		feedback = "Here are " + sb.toString() + ". Add a location to look somewhere else."  + "<span class='backer'></span><span class='opponent'></span>";
	}

	$("#searchMsg").html(feedback.toString());
	$(".backer").votingPop({askedForTxt:$("#travelRequest").val(),understoodTxt:sb.toString(),vote:'Up',parseQuery:parseQuery});
	$(".opponent").votingPop({askedForTxt:$("#travelRequest").val(),understoodTxt:sb.toString(),vote:'Down',parseQuery:parseQuery});

	if(nlpEvent)
	{
		parseResult['nlpEvent'] = true;
		parseResult['zoomLevel'] = eventZoomLevel;
	}
	else
	{
		parseResult['nlpEvent'] = false;
		parseResult['zoomLevel'] = null;
	}

	return parseResult;
}

function isExtraFilter(fId){
	//console.log('Filter Id: ' + fId);
	var isExtraFilter = true;
	$('.filterMenu li[id]').each(function(){
		//console.log($(this).attr('id'));
		if(fId == $(this).attr('id')){
			//console.log('contain');
			isExtraFilter =  false;
		}
	});
	return isExtraFilter;
}

function addExtraFilter(containerId, fId, fName){

	$('#' + containerId + '>ul').prepend('<li class="extraFilter on" id="' +fId +'"> ' + fName.capitalize()+'</li>');
}

function addNewStarRatingListFilterGivenRating(starRating){

	var idSuffix = parseInt(starRating);
	var id='star-' + starRating + '-' + idSuffix;

	var stars = starRating / 10;

	addNewStarRatingListFilterWithClass( id, stars, "extraFilter on" );
}

function addStarRatingListFilterGivenId(starRatingId){

	var starRating = parseInt( starRatingId.split( '-' )[1] );
	var stars = starRating / 10;

	addNewStarRatingListFilterWithClass( starRatingId, stars, "extraFilter" );
}

function addNewStarRatingListFilterWithClass(id, stars, className) {

	var label = (stars == 1)
		? getLocalizedString('hotel-finder.filter.rating.start.item.only.single')
		: getLocalizedString('hotel-finder.filter.rating.start.item.only.multiple').replace('{0}', stars);

	var element = $('#starRatingUl');
	element.children().removeClass('on');
	element.prepend('<li class="' + className + '" id="' + id + '"><label>' + label + '</label><span count="0">(0)</span></li>');
}

function selectAmenityFilter(fId){

	//$('.filterMenu li[id="'+fId+'"]').addClass('on');
	if($('#'+ fId).parent().parent().hasClass('hasSub')){
		//console.log('hasSub');
		$('#'+ fId).parent().show();
		$('#'+ fId).parent().parent().find('h4').addClass("subOff");
		$('li',$('#'+ fId).parent()).removeClass('on');
		$('#'+ fId).addClass('on');
	}else{
		$('#'+ fId).addClass('on');
	}
}

function clearAmentityFilter(){
	$('.filterMenu ul.multiSelect li').removeClass("on");
	$('#starRatingList li').removeClass('on');
	$('#priceList li').removeClass('on');
	$('.filterMenu h4').removeClass("subOff");
	$('.filterMenu li.extraFilter').remove();
	$('.filterMenu .hasSub ul').hide();
	$('#hotelRefine').val('');
	$('#hotelRefine').focus();
	$('#travelRequest').focus();
	$('#travelRequest').val($('#travelRequest').val());

	$("#starRatingList ul.singleSelect li:first-child").addClass("on");
	$("#priceList ul.singleSelect li:first-child").addClass("on");
}

function updateAmenityLabel(){
	var amentiyNum = 0, themeNum = 0,amenityLabel='', amenityColor='', themeLabel='', themeColor='';
	var starRatingNum = 0,priceColor='#222', priceLabel = getLocalizedPriceFilterTitle(), starRatingColor='#222', starRatingLabel = getLocalizedStarRatingFilterTitle();

	amentiyNum = $("#amenitiesList ul li.on").length;
	//console.log('amenity:' + amentiyNum);
		if (amentiyNum == 0) {
			amenityLabel = getLocalizedAmenitiesFilterTitle();
			amenityColor = "#222";
		} else if (amentiyNum == 1) {
			amenityLabel = $("#amenitiesList ul li.on").eq(0).html();
			amenityColor = "#0297d7";
		} else if (amentiyNum > 1) {
			amenityLabel = $("#amenitiesList ul li.on").eq(0).html() + " + " + (amentiyNum - 1);
			amenityColor = "#0297d7";
		}

		themeNum = $("#themesList ul li.on").length;
		//console.log('themeList:' + themeNum);
		if (themeNum == 0) {
			themeLabel = getLocalizedThemesFilterTitle();
			themeColor = "#222";
		} else if (themeNum == 1) {
			themeLabel = $("#themesList ul li.on").eq(0).html();
			themeColor = "#0297d7";
		} else if (themeNum > 1) {
			themeLabel = $("#themesList ul li.on").eq(0).html() + " + " + (themeNum - 1);
			themeColor = "#0297d7";
		}

		starRatingNum = $("#starRatingList ul li.on").length;

		if(starRatingNum > 0 && !$('#anyStar').hasClass('on')){
			starRatingLabel = $("#starRatingList ul li.on label").eq(0).html();
			starRatingColor = "#0297d7";
		}

	//console.log('amenityLabel ' + amenityLabel);

	$(".filterWrapper .amenities span.label").html(amenityLabel).css("color",amenityColor);
	$(".filterWrapper .themes span.label").html(themeLabel).css("color",themeColor);
	$(".filterWrapper .price span.label").html(priceLabel).css("color",priceColor);
	$(".filterWrapper .starRating span.label").html(starRatingLabel).css("color", starRatingColor);
	//$("#sortFilter").html(sortLabel).css('color',sortColor);


}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g, "");
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


function xmlToString(xmlData) {

	var xmlString;
	//IE
	if (window.ActiveXObject||parseInt($.browser.version)>=10){
		xmlString = xmlData.xml;
	}
	// code for Mozilla, Firefox, Opera, etc.
	else{
		xmlString = (new XMLSerializer()).serializeToString(xmlData);
	}
	return xmlString;
}

function getLocation(NLPResponse) {
	if (!window.ActiveXObject||parseInt($.browser.version)>=10) {
		//alert('Not ie');
		var faultCodes=$("ParseFaultList ParseFault FaultCode", NLPResponse).map(function(){
			return {
				value:$(this).text()
			};
		}).get();
		if(faultCodes[0]!=undefined)
			return "error";
		$xml = $(NLPResponse);
		var xmlDoc;
		if(!window.ActiveXObject||parseInt($.browser.version)>=10)
			NLPResponse = $((new XMLSerializer()).serializeToString($xml.find("Parselist Parse")[0]));
		else
			{
			var firstParse=data.selectNodes("//ParseList/Parse")[0];
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async="false";
			xmlDoc.loadXML(firstParse.xml);
			NLPResponse=firstParse.xml;
			}
		var hotellocation = $("Location DestinationList DomainValue DomainList Domain", NLPResponse).map(function () {
			return {
				value: $(this).attr("name")
			};
		}).get();
		if (hotellocation[0] == undefined)
		{
			hotellocation = $("EventList Event DestinationList Domain", NLPResponse).map(function () {
				return {
					value: $(this).attr("name")
				};
			}).get();
		}
		if (hotellocation[0] == undefined) {
			return "";
		}

		return hotellocation[0].value;
	}
	else {
		//alert('ie');
		var nodes = NLPResponse.selectNodes("//ParseFaultList/ParseFault/FaultCode");
		if(nodes.length>0)
			return "error";
		nodes = NLPResponse.selectNodes("//ParseList/Parse/Location/DestinationList/DomainValue/DomainList/Domain");
		if (nodes.length > 0){
			//alert(nodes[0].getAttribute("name"));
			//return nodes[0].childNodes[0].attributes["name"];
			return nodes[0].getAttribute("name");
		}
		return "";
	}


}


function getDates(NLPResponse) {
	if (!window.ActiveXObject||parseInt($.browser.version)>=10) {
		var faultCodes=$("ParseFaultList ParseFault FaultCode", NLPResponse).map(function(){
			return {
				value:$(this).text()
			};
		}).get();
		if(faultCodes[0]!=undefined)
			return "error";
		var dates = [];
		dates.push($("EventList Event TimeRange Start Value", NLPResponse).text())
		dates.push($("EventList Event TimeRange End Value", NLPResponse).text())
		return dates;
	}
	else {
		//Don't care about IE
	}


}

function addDatesToDatePicker(dates)
{
	//setting date using utc
	var dfrom = new Date(dates[0]);
	dfrom.setMinutes(dfrom.getMinutes() + dfrom.getTimezoneOffset());
	var dto = new Date(dates[1]);
	dto.setMinutes(dto.getMinutes() + dto.getTimezoneOffset());
	if(dates[0] === dates[1])
	{
		dto.setDate(dto.getDate() + 1);
	}
	$("#dpfrom").datepicker('setDate', dfrom);
	$("#dpto").datepicker('setDate', dto);
}

function resultListScroll(oEment) {
	if($(oEment).length==0)return;
	var Top_oEment = $(oEment).offset().top;
	var T_scroll = $(".resultsList").scrollTop();
	var headerH = parseInt($("#headerContainer").outerHeight() +  $('.filterBarContainer').outerHeight());
	/*
				var H_oEment = oEment.outerHeight();
				var H_contain = $(".resultsList").outerHeight();
				$(".resultsList").scrollTop(Top_oEment - H_contain + H_oEment + T_scroll);
	 */
	//$(oEment).addClass("resultItemSelected");
	$(".resultsList").scrollTop(Top_oEment + T_scroll - headerH);
}

function getBriefContent(target)
{
		var hotelbrief = hoteldetailsURL(target.attr("id"),'hotelbrief?');
		var content = '';
		//console.log('hotelbrief:' + hotelbrief);

		$.ajax({
			async: false,
			url: hotelbrief,
			success: function (data){
				if(data.hotelId == undefined){
					content = 'Please login in to use this service!';
					window.location.href = 'hotelfinder?from=login';
				}
				if(data.hotelId=='-1')
				{
					content = getLocalizedString("hotel-finder.brief-content.ean-error");
					return;
				}

				var date1 = Date.parse($("#dpfrom").val());
				var date2 = Date.parse($("#dpto").val());

				var priceStr = '';
				if(!isNaN(date1)&&!isNaN(date2))
				{
					if(data.price!=null)
					{
						priceStr = getLocalizedString("hotel-finder.brief-content.employee-rate")
												.replace('{0}', '<span class="hotelPrice">' + data.displayPrice + '</span>');
					}
					else
					{
						var differentDatesAnchor = '<a href="#" onclick="chooseDate()">' +
												getLocalizedString('hotel-finder.brief-content.sold-out.anchor.different-dates') + '</a>';

						var guestCountAnchor = '<a href="#" onclick="chooseGuest()">' +
												getLocalizedString('hotel-finder.brief-content.sold-out.anchor.guest-count') + '</a>';

						var soldOut = getLocalizedString('hotel-finder.brief-content.sold-out')
												.replace('{0}', differentDatesAnchor).replace('{1}', guestCountAnchor);
						priceStr = '<p class="hotelPriceNote">' + soldOut + '</p>';
					}
				}
				else
				{
					var chooseDatesAnchor = '<a href="#" onclick="chooseDate()">' +
												getLocalizedString('hotel-finder.brief-content.choose-dates.anchor') + '</a>';
					var chooseDates = getLocalizedString('hotel-finder.brief-content.choose-dates')
												.replace('{0}', chooseDatesAnchor);
					priceStr = '<p class="hotelPriceNote">' + chooseDates + '</p>';
				}

				var province = data.province=='null'?'':(data.province + ', ');
				var postalCode = data.postalcode=='null'?'':(data.postalcode + ', ');
				var hoverImage = '';
				if(data.imageUrl==null)
				{
					hoverImage = '<p class="thumbnail noPhoto" style="height:100%;text-align:center;line-height:140px;">' +
												getLocalizedString('hotel-finder.brief-content.no-photo') + '</p>';
				}
				else
				{
					hoverImage = '<img title="" alt="" class="thumbnail" src="' + data.imageUrl.replace(/t.jpg$/,"g.jpg") + '" />';
				}

				content = '<h2><a href="#" onclick="hoteldetails('+target.attr("id")+')">' + data.name + '</a></h2>'
				+ '<p class="hotelAddress">' + data.address + ', '+ data.city + ', ' + province + postalCode + data.country + '</p>'
				+ '<div class="hotelRatingOuter"><span class="hotelRating rating stars-lg ir"><span class="value stars' + formatStarRating(data.starRating) + '"></span></span></div>'
				+ '<div class="clearfix">'
					+ '<div class="hotelThumb floatL">' + hoverImage + '</div>'
					+ '<div class="hotelPriceBtn floatR">'
					+ priceStr
					+ '<div class="roundEdgeForIE9 detailsBtnOuter"><a class="blueButton detailsBtn" onclick=\'hoteldetails("'+target.attr("id")+'")\'>' +
												getLocalizedString('hotel-finder.brief-content.view-details') + '</a></div>'
					+ '</div>'
				+' </div>';
			},
			error: function(data){
				content = getLocalizedString('hotel-finder.brief-content.error');
				window.location.href = 'hotelfinder?from=login';
			}});

		return '<div class="clickBubble">' + content + '</div>';
}

function renderHotel(sendRequest)
{
	if ( sessionStorage.getItem("userPrefsExist") != undefined )
	{
		// There are still some user preferences to be set before
		// the hotels should be rendered.
		return;
	}

	// Puts a marker anywhere an Item is present, and loads Hotels from service, showing hover bubble
	removeClickBubble();
	itemsvcHotel.clearItems();
	Hotels.length = 0;

	updateHotelRequest();

	updateMapConfig();
	// Since the evaluate call happens after the map loaded, need to explicitly call makeRequests
	if( sendRequest == true )
	{
		itemsvcHotel.makeRequests();
		itemsvcHotel.clearItemsRequests();
	}
}

function getLCMAttrIds(semanthaid){
	return lcmAmenityIdMappingData.data[semanthaid];
}

function filterHotel(data, content) {
	//console.log(data);
	var hotel;
	if(data.Type == 'hotel')
	{
		var isAvail = true; //default set this hotel is not filter out
		var pricevalue = 0;
		var avail = {}, rate = {}, formatedPrice = "?";
		var hotelImage = null;
		if (data.HotelAvail) avail = data.HotelAvail;
		if (avail.length) avail = avail[0];
		if (avail.Rate) rate = avail.Rate;
		if (rate.length) rate = rate[0];
		if (rate.Price)
		{
			pricevalue = rate.Price.PerNight.Value;
			formatedPrice = rate.Price.PerNight.Text;
		}
		if( data.HotelContent==undefined)
		{
			return;
		}
		if(data.HotelContent!=null && data.HotelContent.Image!=null)
		{
			hotelImage = data.HotelContent.Image.Url;
		}
		var ulli = '';
		var hotelStar=(data.HotelContent.StarRating / 10).toFixed(1);
		hotel = [data.HotelContent.EanId, data.Name, pricevalue, hotelStar, hotelImage, content, formatedPrice, data.Type, null];
		if (getIndexOfHotelId(Hotels,data.HotelContent.EanId)==-1)
		{
			Hotels.push(hotel);
		}
	}
	else if(data.Type == 'hotelcluster')
	{
		hotel = [data.Id, data.Name, null, null, null, content, data.Size, data.Type, data.Border]
		if (getIndexOfHotelId(Hotels,data.Id)==-1)
		{
			Hotels.push(hotel);
		}
	}
}


function stringWithEllipse(str, length, sep, ellipse){
	if(str.split == undefined){
		//console.log(str);
		return str;
	}
	var arr = str.split(sep);
	var result = '';
	for(var i in arr){
		if(result.length + arr[i].length < length){
			result += arr[i];
			if(i!=arr.length-1){
			result += sep;
			}
		}else{
			return result + ellipse;
		}
	}
	return result;
}

var addHotelToListHandler = null;

function addHotelToList(){
	//console.log('addHotelsToList');
	if(addHotelToListHandler!=null){
		////console.log('clear handler' + createTravelRequestHandler);
		clearTimeout(addHotelToListHandler);
	}

	$("#listCount").text(getLocalizedString('hotel-finder.loading'));
	//wait 0.6 second to process
	addHotelToListHandler = setTimeout(function(){addHotelToListHandle();},500);

}

function clearMarkerInMap(){
	$('.priceMarker').hide();
	$('.hotel_available').hide();
	$('.hotel_unavailable').hide();
	//console.log('marker length: ' + ($('.priceMarker').length + $('.hotel_available').length +$('.hotel_unavailable').length));
}

function hotelNameRefine(data){
	var hotelName = data[1].toUpperCase();
	var refineHotelName = trim($('#hotelRefine').val().toUpperCase());
	if(refineHotelName ==''){
		return true;
	}


	var idx = hotelName.indexOf(refineHotelName);
	//console.log(hotelName + ' : ' + refineHotelName +" : " + idx);
	if(idx!=-1){
		return true;
	}

	return false;
}

function clearFilterCount(){
	$('#priceList li span').attr('count','0');
	$('#priceList li span').html('(0)');

	$('#starRatingList li span').attr('count','0');
	$('#starRatingList li span').html('(0)');
}
function addHotelToListHandle() {
	//clearMarkerInMap();
	clearFilterCount();
	//if(Hotels.length>200)
	//	{Hotels.length=0;return;}


	    //return arguments.callee._singletonInstance;


	$("#loadmessagehtml").css("display", "block");
	$(".resultsList ul").empty();

	if (Hotels.length == 0) {
		$("#loadmessagehtml").css("display", "none");
		//$('.resultsList').css('display','none');
		$("#listCount").text(getLocalizedString("hotel-finder.results-in-view.none"));
		$(".zeroCountComment").show();
		//$('.mapcontainer').css('width','100%');
		updateHotelRequest();
		return;
	}
	$('.resultsList').css('display','block');

	//$('#GoogleMap').css('width',$(window).outerWidth() - $('.resultsList').outerWidth());
	//$('.resultsList').css("height",$(window).height() - $('#headerContainer').outerHeight());
	//$('.resultsListBk').css("height,$(window).height() - $('#headerContainer').outerHeight());
	//alert(Hotels.length);
	//console.log('test');
	//Hotels.sort(sortMultiDimensional);
	//alert(Hotels);


	var ulli = '';
	var inViewCount=0;
	var hotelOrder = 0;
	var ullis = [];
	for (var i = 0; i < Hotels.length; i++) {
		//console.log(i);
		if(i>=200){
			break;
		}

		data = Hotels[i];
		if(data[7] == 'hotel')
		{
			if(data[2]>0)
			{
				if(hotelOrder < priceMarkerNum )
				{
					data[5].setOptions({className: "priceMarker",  content:'<span class="priceLabel"><nobr>' + data[6] + '</nobr></span>' + '<span class="markerDot"></span>', id:data[0] });
					$('#' + data[0]).css('left',-parseInt($('#' + data[0]).width()/2));
				}
				else
				{
					data[5].setOptions({className: "hotel_available",content:'', id:data[0]});
				}
			hotelOrder++;
			}
			else
			{
				data[5].setOptions({ className: "hotel_unavailable", id: data[0] });
			}
		}
		else if(data[7] == 'hotelcluster')
		{
			data[5].setOptions({className: "aggregationMarker", id:data[0] });
		}
		//selectedHotelItem = "div[id='" + data[0] + "']";
		//$(selectedHotelItem).show();

		/* only markers shown on view should be counted*/

		//if ($(selectedHotelItem) == undefined)
		//{
		//	console.log('undefined');
		//	continue;
		//}

		//if ($(selectedHotelItem).length == 0)
		//{
		//	console.log('length = 0');
		//	continue;
		//}

		inViewCount++;
		if(data[7] == 'hotel')
		{
			var wholeHotelName = data[1];
			//console.log(data[1]);
			data[1] = stringWithEllipse(data[1],38,' ','...');

			if (data[2] != 0)
			{
				ulli = "<li id='h" + data[0] + "' class='searchsItem clearfix' onclick=''><div id ='sp"+ data[0]+"' class='hotelThumb floatL'>" + handleImage(data[4],data[0]) + " </div>" + "<div class='box floatL'><div class='hotelNameOuter'><h3 class='hotelName' title=\""  + wholeHotelName + "\">" + data[1] + "</h3></div><div class='hotelPriceStaring clearfix'><h2 class='hotelPrice floatR'>" + data[6]+ "</h2>" + '<span class="hotelRating rating stars-lg ir floatL"><span class="value stars' + formatStarRating(data[3]) + '"></span></span></div></div><div class="hoverBtn box blueButton floatR"><span class="hoverIcon"></span></div></li>';
				ullis.push(ulli);
			}
			else
			{
				ulli = "<li id='h" + data[0] + "' class='searchsItem clearfix' onclick=''><div id ='sp"+ data[0]+"' class='hotelThumb floatL'>" + handleImage(data[4],data[0]) + "</div>" + "<div class='box floatL'><div class='hotelNameOuter'><h3 class='hotelName' title=\"" + wholeHotelName + "\">" + data[1] + "</h3></div><div class='hotelPriceStaring clearfix'><span class='noRoomTxt floatR'>" + getLocalizedString('hotel-finder.no-rooms') + "</span>" + '<span class="hotelRating rating stars-lg ir floatL"><span class="value stars' + formatStarRating(data[3]) + '"></span></span></div></div><div class="hoverBtn box blueButton floatR"><span class="hoverIcon"></span></div></li>';
				ullis.push(ulli);
			}
		}
		else if(data[7] == 'hotelcluster')
		{
			var name = data[1].split(",");
			var label = (data[6] == 1)
				? getLocalizedString('hotel-finder.hotels-in-cluster.single')
				: getLocalizedString('hotel-finder.hotels-in-cluster.multiple').replace('{0}', data[6]);
			ulli = "<li id='h" + data[0] + "' class='searchsItem clearfix' onclick='centerBasedZoom(" + data[8].Lat + "," + data[8].Lng + ")'><div class='clusterThumb floatL' /><div class='floatL'><div class='hotelNameOuter'><h3 class='hotelName' title=\"" + data[1] + "\">" + name[0] + "</h3></div><div class='hotelPriceStaring clearfix'><span class='noRoomTxt floatL'>" + label + "</span>" + '</div></div></li>';
			//$(".resultsList ul").append(ulli);
			ullis.push(ulli);
		}
		//$(".resultsList ul").append(ulli);

		/*
		//hotelInfoProcess(data[0],function(eanId,detail){
			//console.log('Call back function' +eanId);
			//console.log($('<img>').attr('src',detail.imageUrl));
			//console.log($("'#s"+data[0]+"'").html());
			//console.log($('#sp107348').html());
			if(detail.imageUrl!=null){
				var imgStr = '<img src="' + detail.imageUrl+ '"/>';
				$('#sp'+eanId).html(imgStr);
			}

			//console.log($('#sp'+eanId).html());
		//});
		*/

		//(function(hotelImg,hotelId){setTimeout(function(){handleImage(hotelImg,hotelId);},100);})(data[4],data[0]);




	}
	searchListHandle(ullis, inViewCount);

	//itemsvcHotel.clearItems();
	//Hotels.length = 0;
	//itemsvcHotel.clearItemDataRequests();

	updateHotelRequest();

}

function boundsBasedZoom(nelat, nelng, swlat, swlng)
{
	var	neLatLong = new aidep.dmap.LatLong(nelat, nelng);
	var	swLatLong = new aidep.dmap.LatLong(swlat, swlng);
	map.fitBounds(new aidep.dmap.Bounds(neLatLong, swLatLong));
}

function centerBasedZoom(lat, lng)
{
	itemsvcHotel.clearItems();
    map.setCenter(new aidep.dmap.LatLong(lat, lng));
	map.setZoom(aggrZoomLevel + 1);
}

function searchListHandle(ullis, inViewCount){
	$(".zeroCountComment").hide();
	var upper = ullis.length<10? ullis.length:10;
	for(var i=0;i<upper;i++){
		var ulli = ullis.shift();
		$(".resultsList ul").append(ulli);
	}

	if(ullis.length>0){
		setTimeout(function(){
			searchListHandle(ullis, inViewCount);
			},100);
	}else{
	if (inViewCount == 0) {
		$("#listCount").text(getLocalizedString("hotel-finder.results-in-view.none"));
		$(".zeroCountComment").show();
	}
	if(inViewCount == 1) {
		$("#listCount").text(getLocalizedString("hotel-finder.results-in-view.single"));
		$(".zeroCountComment").hide();
	}
	if(inViewCount>1){
		$("#listCount").text(getLocalizedString("hotel-finder.results-in-view.multiple").replace('{0}', inViewCount));
		$(".zeroCountComment").hide();
	}
	$("#loadmessagehtml").css("display", "none");
	updateHotelRequest();
}
}

function updateHotelRequest(){
	//request all the available information for hotels
	var date1 = Date.parse($("#dpfrom").val());
	var date2 = Date.parse($("#dpto").val());

	// adding amenity filters by fetching LCMAttrIds for a given SemanthaAttrId
	var amenitygroups = [];
	for(var i=0;i<nlpAmenities.length;i++)
	{
		var lcmAttrIds = getLCMAttrIds(nlpAmenityIds[i]);
		var amenityGroupName = nlpAmenities[i];
		if(lcmAttrIds != undefined && amenityGroupName != undefined)
		{
			amenitygroups.push({'AmenityGroupName':amenityGroupName,'AmenityId':lcmAttrIds});
		}
	}

	//Add hotel filters
	var currency = getCurrencyCode();
	var language = getLocaleId();

	var hotelItemRequest = {
			eanHotelsOnly: true,
			star: {min:nlpStarMin, max:nlpStarMax==0?0:nlpStarMax>=45?nlpStarMax:parseInt(nlpStarMax)+5}, // filter by star rating, 0=All, 50=5 start
			brand: nlpbrand, //filter by brand
			rooms:eval(roomFilter), //filter by room and adult and child
			amenityids: amenitygroups, // nlpamenityids filter by amenity filter ids
			price:nlpPrice,
			hotelSortOrder: nlpSortOrder,
			name: nlpHotelName,
			ids: nlpHotelIds,
			currencyCode: currency,
			language: language
		};

	if(!isNaN(date1)&&!isNaN(date2))
	{
		var d1,d2,los;
		d1 = new Date(date1);
		d2 = new Date(date2);
		los = Math.round((d2-d1)/msInADay);

		$.extend(hotelItemRequest,
			{dates: {min:d1,max:d1,los:{min:los,max:los}}});
		}

		itemsvcHotel.addItemsRequest({'hotels':
		hotelItemRequest
		});

	//Request map item types
	itemsvcHotel.addItemsRequest({'mapItems':
	{
		types:'hotel',
		maxResults:resultCount,
		maxAggregationResults:aggrResultCount,
		aggregationZoomLevel:aggrZoomLevel
	}
	});
}

//function to get random number from 1 to n
function randomToN(maxVal,floatVal)
{
	var randVal = Math.random()*maxVal;
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

var getErrorMsg = function() {
	var messages = [
		getLocalizedString('header.search-field.error-message.1'),
		getLocalizedString('header.search-field.error-message.2'),
		getLocalizedString('header.search-field.error-message.3') ];

	var index = randomToN(messages.length);

	return function() {
		index = (1 + index) % messages.length;
		return messages[index];
	};
}();

//TODO: nlpAmenityIds is now an array
function removeAmenitiesFilter(li_amenity) {
	$("#" + li_amenity + "Id").remove();
	nlpbrand = '';
	var index = nlpAmenities.indexOf(li_amenity);
	var ids = getAmenityIdByName(li_amenity);
	for(var i=0;i<ids.length;i++)
	{
		nlpAmenityIds=nlpamenityids.replace(ids[i], "");
	}
	nlpamenityids = nlpamenityids.replace(/(,)\1+/, "$1");
	nlpAmenities.splice(index, 1);
	renderHotel(true);
	//console.log("removeAmenitiesFilter trigger render");
	addHotelToList();
	addAmenityFilter();
}

function addAmenityFilter() {
	$('#amenitiesContainer').empty();
	if (nlpAmenities.length === 0) {

		$('#amenitiesContainer').append('<li>' + getLocalizedAmenitiesFilterTitle() + '<span class="downIcon"></span></li>');
	}
	else {
		for (var i = 0; i < nlpAmenities.length; i++) {
			$('#amenitiesContainer').append('<li id="' + nlpAmenities[i] + 'Id">' + nlpAmenities[i] + '<span class="closeIcon" onclick="removeAmenitiesFilter(\''+nlpAmenities[i]+'\');"></span></li>');

		}
		$('#amenitiesContainer').append('<li>More<span class="downIcon"></span></li>');
	}
}

function chooseDate(){
	$('#dpfrom').focus();
}

function chooseGuest(){
	setTimeout(function(){
		$('#room-select-text').click();
	},200);

}

function formatStarRating(num){
	return parseInt(10 * num);
}

function dateFormatTransfer(val){
	var array = val.split('-');
	var result =array[1]+'/'+ array[2] +'/'+array[0];
	return result;
}

function eventTimeParse(startTime, endTime){
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var startDate = startTime.substr(0,10);
	var endDate = endTime.substr(0,10);
	var sdArr = startDate.split('-');
	var edArr = endDate.split('-');

	var result = '';
	if(sdArr[1] == edArr[1]){
		var mIdx = parseInt(sdArr[1])-1;
		result = months[mIdx] + ' ' +sdArr[2];
	}else{
		var sIdx = parseInt(sdArr[1])-1;
		var eIdx = parseInt(edArr[1])-1;
		result = months[sIdx] + ' ' +sdArr[2] + ' - ' + months[eIdx] + ' ' + edArr[2];
	}
	return result;

}

function hotelInfoProcess(hotelId, callback){
	var hotelbrief = hoteldetailsURL(hotelId,'hotelbrief?');
	//console.log(hotelbrief);


	$.getJSON(hotelbrief,function(data){
		//console.log('name: ' + data.name);
		//console.log('address: ' + data.address);
		//console.log('price: ' + data.price);
		//console.log('hotel image: ' + data.imageUrl);
		//console.log('hotel star rating' + data.starRating);
		callback.call(this,hotelId,data);
	});
}

var MEDIA_PATH = " https://images.travelnow.com/hotels";
function generateMediaUrl(hotelThumbnail){
	var index = hotelThumbnail.indexOf('_');
	var hotelId = parseInt(hotelThumbnail.substr(0, index));
	var mete = 1000000;
	//StringBuilder sb = new StringBuilder();
	var sb = MEDIA_PATH;
	 for (var i = 0; i < 4; i++)
	{

		var top = parseInt(hotelId / mete) + (hotelId % mete > 0 ? 1 : 0);
		sb += '/' + (mete*top);
		mete /= 100;

	}
	sb += '/' + hotelThumbnail;
 	return sb;
}

function handleImage(imageUrl,hotelId){

	var imgStr = '';
	if(imageUrl!=null){
		var imgSrc = generateMediaUrl(imageUrl);
		 imgStr = '<img src="' + imgSrc + '"/>';
	} else {
		 imgStr = '<p style="height:100%;text-align:center;color:#999;line-height:68px;">No photo</p>';
	}
	//$('#sp' + hotelId).html(imgStr);
	return imgStr;
}

function checkIntroduction() {
	if($('#introduction').length == 0)
	{
		return;
	}

	var showIntro = getURLParameter('from');

	if(showIntro == 'login')
	{
		setTimeout(function(){
			showIntroduction();
			}, 500);
	}
	else
	{
		$('body').css({'overflow-x':'auto','overflow-y':'hidden'});
	}
}

function showIntroduction(){
	$("#introduction").dialog({
		modal: true,
		width: 796,
		height: 510,
		resizable: false,
		position: getIntroPosition(),
		zIndex: 992,
		autoOpen: true,
		title: '',
		draggable: false,
		open: function () {
			$('.ui-widget-overlay').animate({ opacity: 0.8 }, 300);
			$('.ui-dialog-buttonpane').find('button:contains("Send")').addClass("btn-send");
			$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass("btn-close");
			$('#introduction').parent().css('top',getIntroPosition()[1]);
			$('.ui-dialog-titlebar-close').removeClass('ui-dialog-titlebar-close').addClass('close-icon').html('X').unbind('hover').css('textDecoration','none').css('color','#222');
			setTravelRequestWidth();
			setTimeout(function(){
				$(document).unbind('mousedown.dialog-overlay')
                .unbind('mouseup.dialog-overlay');
			},200);
		},

		beforeClose: function (event, ui) {
			//console.log('before close...............');
			$('.ui-widget-overlay').animate({ opacity: 0 }, 300).hide(300);
			$(document).unbind($.ui.dialog.overlay.events);
			$('body').css({'overflow-x':'auto','overflow-y':'hidden'});
			$("#travelRequest").focus();
			$('#introduction').hide();
			setTravelRequestWidth();
			//$('#travelRequest').val('bellevue 3 star with swimming pool');
			//createTravelRequest('enter');
		},
		show: { effect: "fade", duration: 300 },
		hide: { effect: "fade", duration: 300 }
	}).dialog('open');

}

function getIntroPosition(){
	var windowWidth = $(document).width();
	var windowHeight =  $(document).height();
	//console.log(windowWidth + " : " + windowHeight);
	var left = (windowWidth - 740)/2>0? (windowWidth -740)/2:0;
	var top = (windowHeight -480)/2>108 ? (windowHeight-480)/2 :108;
	//console.log(left + ' : ' + top);

	return [left,top];
}

function introductionLink(linkHref){
	//alert(window.location.href);
	var queryIdx = linkHref.indexOf('query');
	var queryStr = '';
	if(queryIdx!=-1){
		queryStr = linkHref.substring(queryIdx+6);
		$('#travelRequest').val(queryStr);
		createTravelRequest('Manual', 'SearchBoxEnter');
	}else{
		var context = $('#context').text();
		window.location.href = context + linkHref;
	}

	$("#introduction").dialog('close');

	//
}

var gemmaVersionHandler = null;
function onPageReady()
{
	$("#travelRequest").keydown(function (event) {
		event.stopPropagation();
			e = event;
			getOldValue();

			if(e.which == 17) isCtrl=true;
			if(e.which == 18) isAlt=true;
			if(e.which == 73 && isCtrl == true && isAlt == true) {
				//run code for CTRL+S -- ie, save!
				openParseWindow();

			}

		}).keyup(function(event){
			e = event;
			if(e.which == 17) isCtrl=false;
			if(e.which == 18) isAlt=false;
		});
	$("#travelRequest").keyup(function (event) { e = event; getData(); });
	//$('body').layout({ applyDefaultStyles: true });
	$("#travelRequest").focus(function(){
		$("#travelRequest").css("border-color","#08B6FF");
	});
	$("#travelRequest").blur(function(){
		$("#travelRequest").css("border-color","#006699");

	});
	$("#travelRequest").focus().val( $("#travelRequest").val());
	$("#travelRequest").css("border-color", "#08B6FF");
//	if ($.browser.msie &&parseInt($.browser.version, 10) == 7)
//	$("#parseDiv").css("top", "26px");

	getGemmaServerData();

	getLcmAmenityIdMappings();
	getPriceMarkerNum();
	getPriceRange();
	Semantha.onLoad();


	// Bind the click event to window
	$("body").click(function (event) {
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
			$('#parsePopup').dialog('close');

		}
	});

	$('body').click(function(event){
		if($('#introduction').css('display')=='none') return true;
		if (($(event.target).closest('.ui-dialog')).length > 0) {
                 // if clicked on a dialog, do nothing
                 return true;
             } else {
                 // if clicked outside the dialog, close it
                 // jQuery-UI dialog adds ui-dialog-content class to the dialog element.
                 // with the following selector, we are sure that any visible dialog is closed.
                 $('#introduction').dialog('close');
                 //$('#introduction').hide();
             }
	});

	$("a#fancyBoxLink").click(function () { openParseWindow(); });
    roomFilter=getRoomFilterJSON();

	roomFilter=getRoomFilterJSON();
}

function getGemmaVersionProcess(){
	//console.log('getGemmaVersionProcess');
	getGemmaVersion();
	gemmaVersionHandler = setTimeout(function(){
		//console.log('setTimeout');
		if($('#gemmaVersion').text()==''){
			getGemmaVersionProcess();
		}else{
			//console.log('clearTimeout');
			clearTimeout(gemmaVersionHandler);
		}
	},2000);
}
function searchIconClick(){
	createTravelRequest('Manual', 'SearchBoxIconClick');
}

/*
	<target name="-init_webapp_properties" depends="build_common_webapp.-init_webapp_properties">
		<property name="output.content" value="${output.war.loose}/resources" />
		<path id="js.merge.files">
			<pathelement path="${output.content}/js/maps/common/Utilities.js" />
			<pathelement path="${output.content}/js/maps/common/Events.js" />
			<pathelement path="${output.content}/js/maps/common/Json.js" />
			<pathelement path="${output.content}/js/maps/Item.js" />
			<pathelement path="${output.content}/js/maps/LatLong.js" />
			<pathelement path="${output.content}/js/maps/Bounds.js" />
			<pathelement path="${output.content}/js/maps/ItemsRequests.js" />
			<pathelement path="${output.content}/js/maps/ItemService.js" />
			<pathelement path="${output.content}/js/maps/google/Map.js" />
			<pathelement path="${output.content}/js/maps/google/Content.js" />
			<pathelement path="${output.content}/js/maps/Provider.js" />
		</path>
		<property name="js.merged.file" value="resources/js/Map-Full.js" />

 */
