/**
 * Copyright 2013 Expedia, Inc. All rights reserved.
 * EXPEDIA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */
//Declaring the capture namespace
(function( capture, $, undefined) {
	//Defining a global object to store the Search Query ID
	var captureSearchQueryParam= {};

  capture.addCaptureInfo = function (url) {
    var searchQueryId = capture.getSearchQueryId(),
        browserGUID = capture.getBrowserGuid();

    return url + '&searchQueryId=' + searchQueryId + '&browserGUID=' +browserGUID;
  };

  capture.getSearchQueryId = function () {
    return captureSearchQueryParam.SearchQueryId || 'null';
  };

  capture.getBrowserGuid = function () {
    // There should always be a browser GUID from login
    return captureSearchQueryParam.BrowserGUID;
  };
	
	capture.getSearchQueryParams = function() {
		return captureSearchQueryParam;
	};

  //Function to be overridden in the page if any page specific data is to be added
  capture.pageSpecificCaptureInfo = function() {};

  capture.captureCommonData = function() {

    //Store all the attributes we want to capture in an array
    var commonCaptureAttributes = ['TM.Timestamp','UV.TimestampGMT','TM.IPAddress',
      'TM.Referrer','TM.PointOfSale','TM.Locale','TM.SessionId','TM.PageURL',
      'UV.PageTitle', 'UV.BrowserGUID','TM.BrowserType','TM.MobileDeviceType',
      'UV.EventType','UV.EventTrigger', 'UV.PersonalizationId','UV.SearchQueryId',
      'UV.SelectedLocale','UV.SelectedExperience','UV.OS','UV.ScreenResolution'];
    	
    //variable to store the JSON Object
    var captureCommonJSON = {};
    	
    //Initializing the default value for all the attributes as null
    jQuery.each(commonCaptureAttributes, function(key,value) {
      captureCommonJSON[value] = '';
    });
   	
    /**
     * Function to find the mobile device type if any
     * Requires mobile-detect.js
     */
    var getMobileDeviceType = function() {
          var type = 'N/A';
          if (mobileDetect.mobile() != null) {
              type = mobileDetect.os();
          }
          return type;
    };
    	
    /**
     * Function to get the browser type
     */
    var getBrowserType = function() {
      var navAppName = navigator.appName,
          navUserAgent = navigator.userAgent,
          tem;
      var matchedUserAgent = navUserAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);

      if (matchedUserAgent && (tem = navUserAgent.match(/version\/([\.\d]+)/i)) != null) {
        matchedUserAgent[2] = matchedUserAgent[1];
      }

      matchedUserAgent = matchedUserAgent ? [ matchedUserAgent[1], matchedUserAgent[2] ] : [ navAppName, navigator.appVersion, '-?' ];

      return matchedUserAgent[0] +' '+ matchedUserAgent[1];
    };
    	
    /**
     * Function to get GUID of users' browser
     */
    var getGUID = function() {
      var browserGUIDStr = function () {
        return Math.floor(
          Math.random() * 0x10000 /* 65536 */
        ).toString(16);
      };

      var finalGUIDStr = 	browserGUIDStr() + browserGUIDStr() + "-" +
          browserGUIDStr() + "-" +
          browserGUIDStr() + "-" +
          browserGUIDStr() + "-" +
          browserGUIDStr() + browserGUIDStr() + browserGUIDStr();

      return (finalGUIDStr);
    };
    	
    /**
     * Function to get OS of the user
     */
    var getOS = function() {
      var userPlatform = navigator.platform,
          userAgent = navigator.userAgent,
			    startIndex = userAgent.indexOf('('),
			    stopIndex = userAgent.indexOf(')'),
          osVersion = 'Unknown OS';

      if (userPlatform.match(/Win/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Windows";
      }
      else if(userPlatform.match(/Mac/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Mac OS";
      }
      else if(userPlatform.match(/Linux/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Linux";
      }
      else if(userPlatform.indexOf(/X11/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "UNIX";
      }
      else if(userPlatform.indexOf(/OpenBSD/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Open BSD";
      }
      else if(userPlatform.indexOf(/SunOS/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Sun OS";
      }
      else if(userPlatform.indexOf(/QNX/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "QNX";
      }
      else if(userPlatform.indexOf(/BeOS/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "BeOS";
      }
      else if(userPlatform.indexOf(/OS\/2/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "OS/2";
      }
      else if(userPlatform.indexOf(/nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver/i)) {
        osVersion = userAgent.substring(startIndex+1,stopIndex) || "Search Bot";
      }

      return osVersion;
    };
    	
    	
    //To capture the time at client's machine
    var now = new Date();

    captureCommonJSON["TM.Timestamp"] = now.format('yyyy.mm.dd-HH.MM.ss');//toString();//
    captureCommonJSON["TM.IPAddress"] = "";//This has to happen in serverside code to get actual IP address of the client
    captureCommonJSON["TM.Referrer"] = document.referrer || document.URL;//Set the value as referrer URL or else the URL of the page if no referrer found
    captureCommonJSON["TM.PointOfSale"] = "";//Applicable in Booking page else is null
    captureCommonJSON["TM.Locale"] = navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;//Capturing the user's locale within the browser
    captureCommonJSON["TM.PageURL"] = document.URL;
    captureCommonJSON["TM.BrowserType"] = getBrowserType();
    captureCommonJSON["TM.MobileDeviceType"] = getMobileDeviceType();

    captureCommonJSON["UV.TimestampGMT"] = now.format('yyyy.mm.dd-HH.MM.ss',now.toUTCString());//toUTCString().toString();//
    captureCommonJSON["UV.PageTitle"] = document.title;
    captureCommonJSON["UV.BrowserGUID"] = getGUID();
    captureCommonJSON["UV.SelectedLocale"] = $.cookie( 'localeId' ) || 'en_US';//capturing the language preference selected by User - default is en_US
    captureCommonJSON["UV.ScreenResolution"]= screen.width+' X '+screen.height;//Screen Resolution = "width X height"
    captureCommonJSON["UV.OS"] = getOS();
    captureCommonJSON["UV.EventType"] = "";//To be set in the calling page if applicable
    captureCommonJSON["UV.EventTrigger"] = "";//To be set in the calling page if applicable
    captureCommonJSON["UV.PersonalizationId"] = "";//To be set as per server data - is the logged in user's email ID
    captureCommonJSON["UV.SearchQueryId"] = getGUID();//Random for all pages unless overridden. To be overridden in the details and booking page if applicable
    captureCommonJSON["UV.SelectedExperience"] = "";//The experience selected on the Experience Picker page

    //return the key - value pairs for the JSON object
    return captureCommonJSON;
  };
    
  capture.xml2Str = function(xmlNode) {
    try {
      // Gecko-based browsers, Safari, Opera.
      return (new XMLSerializer()).serializeToString(xmlNode);
    }
    catch (e) {
      try {
        // Internet Explorer.
        return xmlNode.xml;
      }
      catch (e) {
        //Strange Browser ??
        return '';
      }
    }
  };

  capture.sendCaptureRequest = function(eventType,eventTrigger,sendStatus,callback) {

    //Create an object to store the capture Info for the page
    var captureData = {};
    //Declare a variable to store the capture API URL
    var captureApiURL;
    if(document.getElementById('ip_captureApiURL') != null) {
      captureApiURL = document.getElementById('ip_captureApiURL').value || '';//This variable should be configurable as per environments. A JSP elements should have this value.
    }
    //Retrieving the common capture data
    captureData = capture.captureCommonData();
    //Retrieving page specific data for capture if any
    var pageData = capture.pageSpecificCaptureInfo() || {};
    //Including the page specific capture data in the capture object to send
    jQuery.each(pageData, function(key,value) {
      captureData[key] = value;
    });

    //If eventType is an object then length would be undefined
    if(eventType.length==undefined) {
      //Including the event specific capture data in the capture object to send
      jQuery.each(eventType, function(key,value) {
        captureData[key] = value;
      });
    }
    else {
      captureData["UV.EventType"] = eventType || '';//Just state the eventType
    }

    //Setting the page specific event data. Page specific data overrides the existing data in case of duplicate entry
    captureData["UV.EventTrigger"] = eventTrigger || '';//this needs to be dynamic as per the event



    //Store the SearchQueryID in the global Array
    captureSearchQueryParam["SearchQueryId"] = captureData["UV.SearchQueryId"];
    captureSearchQueryParam["BrowserGUID"] = captureData["UV.BrowserGUID"];

    if(sendStatus==true) {
      //Send the capture data only if captureApiURL is specified
      if(captureApiURL != null && captureApiURL!=undefined && captureApiURL!='') {
        var captureDataResult;
        if(callback == undefined) {
          captureDataResult = capture.captureData(captureData,captureApiURL);
        }
        else {
          captureDataResult = capture.captureData(captureData,captureApiURL,callback);
        }
        return captureDataResult;
      }
      return "captureApiURLUndefined";
    }
    return "receivedSendStatusFalse";
  };

  capture.captureData = function(jsonData,captureApiURL,callback) {
    var xmlhttp;
    if (window.XDomainRequest) {

      xmlhttp = new XDomainRequest();

      xmlhttp.open('POST', captureApiURL);

      xmlhttp.onload = function (){
        //Do nothing but need to hook
        if(callback!=undefined) {
          callback.call(this);
        }
      };

      xmlhttp.onprogress= function(){};

      xmlhttp.ontimeout = function(){};

      xmlhttp.onerror = function(){
        return "captureApiURLXDomainRequestError";
      };
    }
    else {
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
      }
      else {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.open("PUT", captureApiURL, true);
      xmlhttp.setRequestHeader("Accept", "application/json");

      xmlhttp.setRequestHeader("Content-Type", "application/json");

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && callback != undefined) {
          callback.call(this);
        }
      };

      xmlhttp.addEventListener("error", function(evt) {
        return "captureApiURLXMLHttpRequestError";
      });
    }

    xmlhttp.send(JSON.stringify(jsonData));
    return "success";
  };

  //Define a function to get Adults count
  capture.getAdultsCount = function() {
    var adultsCount = 0;
    $('#div_roomGuestContainer select.adultsCount').each(function(){
      adultsCount += parseInt($(this).val());
    });
    return adultsCount;
  };

  //Define a function to get Children count
  capture.getChildrenCount = function(){
    var childCount = 0;
    $('#div_roomGuestContainer .children select').each(function(){
      childCount += parseInt($(this).val());
    });
    return childCount;
  };

  //Define a function to get suggested queries
  capture.getSuggestedQueries = function() {
    var result = '';
    //myData is a global variable used by Gemma in Semntha.js
    for(var idx in myData){
      result += myData[idx].value +',';
    }
    return result.substring(0, result.length-1);
  };

  //Define a function to get clicked suggestion's rank
  capture.getClickedSuggestionRank = function() {
    var query = $('#ip_travelRequest').val();
    var index = 0;
    //myData is a global variable used by Gemma in Semntha.js
    for(var idx in myData){
      if( query == myData[idx].value) {
        index = parseInt(idx) + 1;
        break;
      }
    }

    if(index==0) {
      index='';
    }

    return index;
  };

  //Define a function to get values selected in amenities filter - nlpAmenities is a global defined in Semantha.js
  capture.getAmenities = function(nlpAmenities) {
    var amenitiesListContainer = $('#ul_multiSelect');
    var selectedAmenities = '';

    amenitiesListContainer.children(".on").each(function(index) {
      if(selectedAmenities=='') {
        selectedAmenities = $(this).attr('id').toLowerCase();
      }
      else {
        selectedAmenities += ','+$(this).attr('id').toLowerCase();
      }
    });

    amenitiesListContainer.children().each(function(count) {
      if($(this).attr('class')=='hasSub') {
        $(this).children('ul').children(".on").each(function(i) {
          if(selectedAmenities=='') {
            selectedAmenities = $(this).attr('id').toLowerCase();
          }
          else {
            selectedAmenities += ','+$(this).attr('id').toLowerCase();
          }

        });
      }
    });

    return selectedAmenities;
  };

  //Define a function to get values selected in themes filter
  capture.getThemes = function() {
    var themeListContainer = $('#ul_multiThemesSelect');
    var selectedThemes = '';
    themeListContainer.children(".on").each(function(index) {
      if(selectedThemes=='') {
        selectedThemes = $(this).attr('id').toLowerCase();
      }
      else {
        selectedThemes += ','+$(this).attr('id').toLowerCase();
      }
    });

    themeListContainer.children().each(function(count) {
      if($(this).attr('class')=='hasSub') {
        $(this).children('ul').children(".on").each(function(i) {
          if(selectedThemes=='') {
            selectedThemes = $(this).attr('id').toLowerCase();
          }
          else {
            selectedThemes += ','+$(this).attr('id').toLowerCase();
          }

        });
      }
    });

    return selectedThemes;
  };

  //Define a function to get values selected in star rating filter
  capture.getStarRatingFilter = function() {
    var starListContainer = $('#ul_starRating');
    var selectedStarFilter= '';
    starListContainer.children(".on").each(function(index) {
      if(selectedStarFilter=='') {
        selectedStarFilter = $(this).attr('id').toLowerCase();
      }
      else {
        selectedStarFilter += ','+$(this).attr('id').toLowerCase();
      }
    });
    return selectedStarFilter;
  };

  //Define a function to get values selected in price filter
  capture.getPriceFilter = function() {
    var priceListContainer = $('#ul_priceList');
    var selectedPriceFilter= '';
    priceListContainer.children(".on").each(function(index) {
      if(selectedPriceFilter=='') {
        selectedPriceFilter = $(this).attr('id').toLowerCase();
      }
      else {
        selectedPriceFilter += ','+$(this).attr('id').toLowerCase();
      }
    });
    return selectedPriceFilter;
  };

  //Define a function to show number of results for bothnormal and aggregated views
  capture.getNumberOfResults = function() {
    return Object.size(itemsvcHotel.items);
  };

  //Define a function to determine if it is aggregate mode or not
  capture.isAggregateMode = function() {
    var firstKeyName='', key;
    for(key in itemsvcHotel.items) {
      firstKeyName = key;
      if(firstKeyName != '') {
        break;
      }
    }

    if(firstKeyName.toString().indexOf("hotelcluster")==-1) {
      return 'false';
    }
    else {
      return 'true';
    }
  };

  //Define a function to return hotel list of aggregate mode is false
  capture.getHotelList = function() {
    var keyName='', key;
    for(key in itemsvcHotel.items) {
      //key.toString().substring(key.toString().indexOf(".")+1);//this is expedia ID
      if(key.toString().indexOf("hotelcluster")==-1) {
        if(keyName=='') {
          keyName = itemsvcHotel.items[key].data.HotelContent.EanId;//this is EAN ID
        }
        else {
          keyName += ' | ' + itemsvcHotel.items[key].data.HotelContent.EanId;
        }

      }
      else {
        //Do nothing as it is a hotel cluster
      }

    }
    return keyName;
  };

  //Define a function to return cluster list if aggregate mode is true
  capture.getClusterList = function() {
    var keyName='', key;
    for(key in itemsvcHotel.items) {
      //key.toString().substring(key.toString().indexOf(".")+1);//this is expedia ID


      if(key.toString().indexOf("hotelcluster")==-1) {
        //Do nothing as it is a hotel list
      }
      else {
        if(keyName=='') {
          keyName = itemsvcHotel.items[key].data.Id+'-'+itemsvcHotel.items[key].data.Size;//this is cluster id and size
        }
        else {
          keyName += ' | ' + itemsvcHotel.items[key].data.Id+'-'+itemsvcHotel.items[key].data.Size;
        }
      }
    }
    return keyName;
  };

  //Define a function to get viewport details  NE,SW lat longs
  capture.getViewPort = function() {
    if (itemsvcHotel.lastBoundsWithExtra == null) {
      itemsvcHotel.lastBoundsWithExtra = map.getBounds();
    }

    return (itemsvcHotel.lastBoundsWithExtra['ne']['lat'] + ',' +
    itemsvcHotel.lastBoundsWithExtra['ne']['lng'] + ',' +
    itemsvcHotel.lastBoundsWithExtra['sw']['lat'] + ',' +
    itemsvcHotel.lastBoundsWithExtra['sw']['lng']);
  };

  //Override a custom function to send Page specific capture Info
  capture.pageSpecificCaptureInfo = function() {

    var pageInfo = new Object();

    //Fetch server data
    if(captureServerData==null) {
      capture.fetchServerData();
    }

    //Set page specific properties
    pageInfo["TM.PointOfSale"] = "BEST - Expedia Inc.";
    if(captureServerData!=null && captureServerData!='' && captureServerData!=undefined ) {
      pageInfo["TM.IPAddress"] = captureServerData.iPAddress;
      pageInfo["TM.SessionId"] = captureServerData.sessionId;
      pageInfo["UV.SemanthaVersion"] = captureServerData.extraData['UV.SemanthaVersion'];
      pageInfo["UV.NautilusVersion"] = $('#spn_nautilusVersion').text();
      pageInfo["UV.AutoSuggestVersion"] =  $('#spn_gemmaVersion').text();
      pageInfo["UV.SemanthaUserEmail"] = captureServerData.extraData['UV.SemanthaUserEmail'];
      pageInfo["UV.PersonalizationId"] = captureServerData.extraData['UV.SemanthaUserEmail'];
    }
    return pageInfo;
  };

  //Define a function to get server data
  capture.fetchServerData = function() {
    $.ajax({
      dataType: "json",
      url: "captureServerData",
      success: function(data) {
        //Store the data retrieved from the server
        captureServerData = data;
      }
    });
  };

}( window.capture = window.capture || {}, jQuery ));
