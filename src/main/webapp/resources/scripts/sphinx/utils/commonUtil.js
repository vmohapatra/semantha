'use strict';

function getURLParameter(name) {
	if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	      return decodeURIComponent(name[1]);
}

function getLocaleId() {
	// The cookie will (should) always be set by the server
	// If it's not, it's a bug
	return $.cookie( 'localeId' );
}

function getCurrencyCode() {
	// The cookie will (should) always be set by the server
	// If it's not, it's a bug
	return $.cookie( 'cur' );
}

function setCurrencyCode(currencyCode) {
	$.cookie( 'cur', currencyCode, {path: '/'} );
}

function getRoomItems() {
	return $("#fld_roomsGuests .roomItem");
}

function getAndRemoveSessionStorageKey(key) {
	var val = sessionStorage.getItem( key );
	sessionStorage.removeItem( key );
	return val;
}

var getLocalizedString = function() {
    return function(key) {
        return "no localization";
    };

    var localizedStrings = JSON.parse(document.getElementById('localizedStrings').getAttribute('data-json'));


	return function(key) {
		return localizedStrings[key];
	};
}();

/**
 * Utility functions to provide commonly-used localized strings
 */
function getLocalizedDatePickerDefaultStartDate() {
	return getLocalizedString('header.date-picker.default.start-date');
}

function getLocalizedDatePickerDefaultEndDate() {
	return getLocalizedString('header.date-picker.default.end-date');
}

function getLocalizedPriceFilterTitle() {
	return getLocalizedString('hotel-finder.filter.price.title');
}

function getLocalizedStarRatingFilterTitle() {
	return getLocalizedString('hotel-finder.filter.rating.star.title');
}

function getLocalizedAmenitiesFilterTitle() {
	return getLocalizedString('hotel-finder.filter.amenities.title');
}

function getLocalizedThemesFilterTitle() {
	return getLocalizedString('hotel-finder.filter.themes.title');
}

/**
 * Utility function for String manipulation
 */
function StringBuilder() {
	var strings = [];

	this.append = function (string) {
		string = verify(string);
		if (string.length > 0) strings[strings.length] = string;
	};

	this.appendLine = function (string) {
		string = verify(string);
		if (this.isEmpty()) {
			if (string.length > 0) strings[strings.length] = string;
			else return;
		}
		else strings[strings.length] = string.length > 0 ? "\r\n" + string : "\r\n";
	};

	this.clear = function () { strings = []; };

	this.isEmpty = function () { return strings.length == 0; };

	this.toString = function () { return strings.join(""); };

	var verify = function (string) {
		if (!defined(string)) return "";
		if (getType(string) != getType(new String())) return String(string);
		return string;
	};

	var defined = function (el) {
		// Changed per Ryan O'Hara's comment:
		return el != null && typeof (el) != "undefined";
	};

	var getType = function (instance) {
		if (!defined(instance.constructor)) throw Error("Unexpected object type");
		var type = String(instance.constructor).match(/function\s+(\w+)/);

		return defined(type) ? type[1] : "undefined";
	};
}

/**
 * Sets the width of the "travel request" text input box
 */
function setTravelRequestWidth() {

	// Start with the width of the entire header
	var width = $("#div_headerContainer").outerWidth(true);

	// Subtract the width of the logo
	width -= $("div.logoContainer").outerWidth(true);

	// The 'search criteria' div contains the travelRequest, and has a left margin that we must subtract.
	var searchCriteria = $("#div_searchCriteria");
	width -= (searchCriteria.outerWidth(true) - searchCriteria.width());

	// Similarly, subtract the margin/border/padding of the travelRequest element itself,
	// since the width does not include these
	var travelRequest = $("#ip_travelRequest");
	width -= (travelRequest.outerWidth(true) - travelRequest.width());

	// Subtract the width of the search button...
	//width -= $("#lnk_search").outerWidth(true); //No more needed as search icon is placed inside the search ip box

	// ... and the date picker...
	width -= $("#div_datepicker").outerWidth(true);

	// ... and the view reservations container
	width -= $("#div_viewReservationsContainer").outerWidth(true);

	// ... and the view Language container
	width -= $("#div_viewLanguageContainer").outerWidth(true);

	// ... and the rooms/guests selector...
	width -= $("#div_roomSelect").outerWidth(true);

	// ... and finally the settings container.
	width -= $("#div_settingsContainer").outerWidth(true);

	width += 15;//Adjusting the width to offset width after settings block

	if($('#div_micBtnContainer').css('display')=='block'){
		$('#ip_travelRequest').css("width",width - 24 - 3 + 43 - 12 + 14); // fixed bug [DEMO-965]
		$('#div_input').css("margin-left","40px");
	} else {


        //Adjustment for IE 8
        if($.browser.msie && $.browser.version == 8) {
            $('#ip_travelRequest').css("width",width - 3 + 43 - 12 + 14 - 2);
        }
        //Rest of the browsers
        else {
            $('#ip_travelRequest').css("width",width - 3 + 43 - 12 + 14);
        }
	}

}

/**
 * Adjusts the width of the specified element based on the length of its placeholder text.
 * IE does not support the placeholder attribute. So for this to work on IE, define a
 * custom attribute called 'customPlaceholder' that holds the placeholder text as well.
 */
function adjustWidthBasedOnPlaceholder(element) {

	// Create a span element around the placeholder text of the element
	// (which is most likely going to be a textbox) whose width needs to
	// be adjusted based on its placeholder text.
	// Getting the width on the span element will give the width in px.
	// Delete the span element when done.

	var testSpan = document.createElement( "span" );
	var testSpanElement = $(testSpan);

	var spanContent = document.createTextNode( element.attr("customPlaceholder") );
	testSpan.appendChild( spanContent );

	element.parent().prepend( testSpan );

	testSpanElement.attr({
	    'style': 'visibility:hidden',
	    'class': element.attr('class')
	});

	testSpanElement.css( "font", element.css('font') );

	// Add the width of the 'padding + border + margin' of the existing
	// element to the width of the test span element.
	var extraWidth = element.outerWidth(true) - element.width();
	element.css( "width", testSpanElement.width() + extraWidth );

	testSpanElement.remove();
}

/**
 * Constructs a string that encapsulates the room details information as
 * selected by the user.
 *
 * The format of the string is as follows:
 * "adultCountRoom1,child1_age,...childN_age-adultCountRoom2,child1_age,...childN_age"
 * and so on.
 */
function getRoomDetails() {

	var roomDetails = '';
	var roomItems = getRoomItems();
	var roomCount = roomItems.length;

	roomItems.each(function(roomIdx) {
		roomDetails = roomDetails + $(this).find('select.adultsCount').val();
		$(this).find('div.childAge select:enabled').each(function(idx) {
			var age = $(this).val();
			if ( age != '' )
			{
				roomDetails = roomDetails + ',' + age;
			}
		});

		if( roomIdx < roomCount-1 )
		{
			roomDetails = roomDetails + '-';
		}
	});

	return roomDetails;
};

function isDateless() {
  var dpFrom = $("#ip_dpfrom").val(),
      dpTo = $("#ip_dpto").val();

  return (dpFrom.indexOf('/') === -1 && dpTo.indexOf('/') === -1);
}

function getLengthOfStay(checkInDate, checkOutDate){

  var los;

  if(!isNaN(checkInDate) && !isNaN(checkOutDate)) {
    var d1 = new Date(checkInDate),
        d2 = new Date(checkOutDate);

    los = Math.round((d2-d1)/msInADay);
  }

  return los;
}


$('div.logoContainer').click(function(){window.location.href='hotelfinder?from=login'});


// String overrides
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

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
// Implementation of Array.prototype.forEach
(function() {

	if (!Array.prototype.forEach) {

	  Array.prototype.forEach = function(callback, thisArg) {

	    var T, k;

	    if (this == null) {
	      throw new TypeError(' this is null or not defined');
	    }

	    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	    var O = Object(this);

	    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
	    // 3. Let len be ToUint32(lenValue).
	    var len = O.length >>> 0;

	    // 4. If IsCallable(callback) is false, throw a TypeError exception.
	    // See: http://es5.github.com/#x9.11
	    if (typeof callback !== "function") {
	      throw new TypeError(callback + ' is not a function');
	    }

	    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	    if (arguments.length > 1) {
	      T = thisArg;
	    }

	    // 6. Let k be 0
	    k = 0;

	    // 7. Repeat, while k < len
	    while (k < len) {

	      var kValue;

	      // a. Let Pk be ToString(k).
	      //   This is implicit for LHS operands of the in operator
	      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
	      //   This step can be combined with c
	      // c. If kPresent is true, then
	      if (k in O) {

	        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
	        kValue = O[k];

	        // ii. Call the Call internal method of callback with T as the this value and
	        // argument list containing kValue, k, and O.
	        callback.call(T, kValue, k, O);
	      }
	      // d. Increase k by 1.
	      k++;
	    }
	    // 8. return undefined
	  };
	}
})();
