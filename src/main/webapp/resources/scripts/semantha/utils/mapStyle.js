/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 * This file stores the styles for the map
 */
var customMapStyles = [
  // Water color
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          { "color": "#98C8DC" }
      ]
  //Land area color fill
  },
  {
      "featureType": "landscape.natural",
      "stylers": [
          { "lightness": -8 },
          { "saturation": -80 }
      ]
  },
  {
      "featureType": "landscape.natural.landcover",
      "stylers": [
          { "lightness": 50 },
          { "saturation": -100 }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          { "visibility": "off" }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          { "lightness": 40 },
          { "gamma": .4 }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          { "saturation": -60 }
      ]

  },
  {
      "featureType": "landscape.man_made",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 20 }
      ]
  },
  {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [
          { "hue": "#ffee00" },
          { "saturation": 50 }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 100 }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 60 }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
          { "lightness": 20 }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 30 }
      ]
  },
  // Road labels & icons
  {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 10 }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 10 }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
          { "saturation": -40 },
          { "lightness": 40 }
      ]
  },
  // Land labels
  {
      "featureType": "administrative.country",
      "elementType": "labels",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 15 }
      ]
  },
  {
      "featureType": "administrative.province",
      "elementType": "labels",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 15 }
      ]
  },
  {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 15 }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 15 }
      ]
  },
  // Transit line geometry & labels
  {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
          { "lightness": -10 },
          { "saturation": -50 },
          { "hue": "#0091ff" }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "labels",
      "stylers": [
          { "visibility": "off" }
      ]
  },
  {
      "featureType": "transit.station",
      "elementType": "labels",
      "stylers": [
          { "saturation": -100 }
      ]
  },
  // POI labels & icons
  {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
          { "saturation": -100 },
          { "lightness": 40 }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "stylers": [
          { "visibility": "off" }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "labels.text",
      "stylers": [
          { "visibility": "off" }
      ]
  }
        ];

//function to adjust aggregation map marker styles as per zoom levels
function aggregationMapMarkerStyler (cluststerInfo, map) {
    var mapZoomLevel = map.getZoom(),
        aggregationId = cluststerInfo.get('itemId'),
        hotelCount = cluststerInfo.get('itemSize'),
        styles = {};

    // IE8 resolving
    if($.browser.msie && $.browser.version<=8) {
      $('.aggregationMarker').css({
        "background-color":  "#02ADF7",
        filter: "alpha(opacity=60)"
      });
    }

    var currentMarker = document.getElementById(aggregationId);

    if (currentMarker == null) {
      return;
    }

    if(mapZoomLevel <= 2) {
        if (hotelCount <= 192) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
    }
    else if(mapZoomLevel == 3) {
        if (hotelCount <= 122) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }			
    } 
    else if(mapZoomLevel == 4) {
        if (hotelCount <= 73) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
    } 
    else if(mapZoomLevel == 5) {
        if (hotelCount <= 41) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 55) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 73) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(18);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(19);
          $(currentMarker).css(styles);
        }
    } 
    else if(mapZoomLevel == 6) {
        if (hotelCount <= 22) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 30) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 41) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 55) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 73) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 862) {
          styles = calculateMarkerStyle(18);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(19);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(20);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(21);
          $(currentMarker).css(styles);
        }
    } 
    else if(mapZoomLevel == 7) {
        if (hotelCount <= 12) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 16) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 22) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 30)
        {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 41) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 55) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 73) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(18);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(19);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(20);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(21);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1536) {
          styles = calculateMarkerStyle(22);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(23);
          $(currentMarker).css(styles);
        }
    } 
    else if(mapZoomLevel == 8) {
        if (hotelCount <= 7) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 9) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 12) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 16) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 22) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 30) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 41) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 55) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 73) {
          styles = calculateMarkerStyle(8);
            $(currentMarker).css(styles);			
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(18);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(19);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(20);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(21);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1142) {
          styles = calculateMarkerStyle(22);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 1327) {
          styles = calculateMarkerStyle(23);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(24);
          $(currentMarker).css(styles);
        }
    } 
    else if(mapZoomLevel >= 9) {
        if (hotelCount <= 3) {
          styles = calculateMarkerStyle(0);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 5) {
          styles = calculateMarkerStyle(1);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 7) {
          styles = calculateMarkerStyle(2);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 9) {
          styles = calculateMarkerStyle(3);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 12) {
          styles = calculateMarkerStyle(4);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 16) {
          styles = calculateMarkerStyle(5);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 22) {
          styles = calculateMarkerStyle(6);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 30) {
          styles = calculateMarkerStyle(7);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 41) {
          styles = calculateMarkerStyle(8);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 55) {
          styles = calculateMarkerStyle(9);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 73) {
          styles = calculateMarkerStyle(10);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 95) {
          styles = calculateMarkerStyle(11);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 122) {
          styles = calculateMarkerStyle(12);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 154) {
          styles = calculateMarkerStyle(13);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 192) {
          styles = calculateMarkerStyle(14);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 237) {
          styles = calculateMarkerStyle(15);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 290) {
          styles = calculateMarkerStyle(16);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 352) {
          styles = calculateMarkerStyle(17);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 424) {
          styles = calculateMarkerStyle(18);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 507) {
          styles = calculateMarkerStyle(19);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 602) {
          styles = calculateMarkerStyle(20);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 711) {
          styles = calculateMarkerStyle(21);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 836) {
          styles = calculateMarkerStyle(22);
          $(currentMarker).css(styles);
        }
        else if (hotelCount <= 979) {
          styles = calculateMarkerStyle(23);
          $(currentMarker).css(styles);
        }
        else {
          styles = calculateMarkerStyle(24);
          $(currentMarker).css(styles);
        }
    }
}

/**
 * Returns map marker css styles given a multipler. Starting from some base values for properties
 * like height, width, etc, add some other values times 'multipler' to each one.
 *
 * @param {Number} multiplier - Number value >= 0 to multiply adder by
 * @returns {Object} Styles of marker with values set as such [height: '16px'], empty object on error
 */
function calculateMarkerStyle (multiplier) {
  var base = {
      height: 12,
      width: 12,
      'line-height': 10,
      top : -5,
      left : -6
    },
    adder = {
      height : 4,
      width : 4,
      'line-height': 2,
      top : -2,
      left : -2
    },
    result = {};

  // Multiplier must be a number gte 0
  if (!_.isNumber(multiplier) || multiplier < 0) {
    return result;
  }

  // Mutiply each value in adder by multiplier
  var add = lodash.mapValues(adder, function (value) { return value * multiplier });

  // Error maping values, return empty
  if (_.isEmpty(add)) {
    return result;
  }

  // Create a result object with the same keys of base, where each value at key in result
  // is the sum of base[key] and add[key] with string 'px' appened
  lodash.keys(base).forEach(function (key) {
    result[key] = lodash.sum([base, add], key).toString() + 'px';
  });

  return result;
}
