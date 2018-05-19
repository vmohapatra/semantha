var Item = aidep.dmap.Item,//import
	  LatLong = aidep.dmap.LatLong,//import
	  Util = aidep.dmap.common.Utilities,//import
	  ITEM_SVC_EVENT_NAMES = [],
	  ITEM_SVC_EVENT_HANDLERS = {},
    ItemService,
    s_serviceURL,
    DATA_FIELDS = ['Address','Bounds','Image','Price','Star','EanId','Size'];

Util.namespace('aidep.dmap');

/**
 * @namespace ItemService uses Dynamic Maps REST service to provide {aidep.dmap.Item} for display
 * 
 * @param {aidep.dmap.Map} map the map to associate with this service
 * @param {aidep.dmap.ItemService.Configuration} config the configuration for this service.  Also accepts an Associative array Object with the same key names as Configuration.
 * @returns {aidep.dmap.ItemService}
 */
aidep.dmap.ItemService=function(map,config){
	this.events=new aidep.dmap.common.Events(this, ITEM_SVC_EVENT_NAMES, ITEM_SVC_EVENT_HANDLERS);
	this.map=map;
	this.config=new aidep.dmap.ItemService.Configuration(config);
	
	this.items={};
	this.itemRequests={};
	this.dataRequests={'Bounds':true};// Map should always be requesting Bounds
	this.boundsWithExtraRequested=[]; // tracks viewable area+requestExtra.
	this.lastBoundsWithExtra=null;
	
	if(this.config.removeItemsNotVisible) {
		this.addEventListener(ItemService.EVENT_ITEM_DATA_UPDATED, function() {
			this.retainItemsInBounds();
		});
	}
	addMapListeners(map, this);
};
ItemService=aidep.dmap.ItemService;

/**
 * Set the URL to use 
 * @param url DMap REST Service URL to invoke.
 */
aidep.dmap.ItemService.setServiceUrl=function(url) {
	s_serviceURL=url;
};

/**
 * @namespace Configuration properties for aidep.dmap.ItemService constructor.
 * @property {Number} requestExtra amount of extra space (as decimal percentage) that should be requested outside of the viewport.  This is used to fetch extra data so pan can appear smoother over slow connections.  Asking of 1.0 means requesting 4 times more area to cover an area 50% greater in each cardinal direction.  Default:1
 * @property {Number} requestBuffer minimum amount of extra space (as decimal percentage of requestExtra, 0-1) before a new request should be sent for more data.  The higher this value, the less network network requests will be made, but may result in visible delay.  Default:0.5
 * @property {Boolean} removeItemsNotVisible remove items not in the visible bounds (+ requestExtra space).  Default false so that manually added items aren't removed.
 * @param {Object} config initial configuration
 */

aidep.dmap.ItemService.Configuration=function(config) {
	config=config||{};
	this.requestExtra=Math.min(0, config.requestExtra||1);
	this.requestBuffer=Math.min(0, Math.max(1, config.requestBuffer||0.5));
	this.removeItemsNotVisible=config.removeItemsNotVisible;
};

/**
 * @event 
 * @description Event fired when the map provider is loaded.  Fired by either addItems, or as a result of requestItems
 * @param {Array} Array of aidep.dmap.Item added.
 */
aidep.dmap.ItemService.EVENT_ITEM_ADDED='itemadded';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_ITEM_ADDED);

/**
 * @event
 * @description Event fired when an item is removed from the map due to a call to #removeItem
 * @param {Array} Array of aidep.dmap.Item removed
 */
aidep.dmap.ItemService.EVENT_ITEM_REMOVED='itemremoved';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_ITEM_REMOVED);

/**
 * @event
 * @description Event fired when data is added to one or more items
 * @param {Array} Array of aidep.dmap.Item updated
 */
aidep.dmap.ItemService.EVENT_ITEM_DATA_UPDATED='itemdataupdated';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_ITEM_DATA_UPDATED);


/**
 * @event
 * @description Event fired when the request is sent to the service for Item or Data
 * @param {XMLHttpRequest} request
 */
aidep.dmap.ItemService.EVENT_REQUEST_START='requeststart';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_REQUEST_START);

/**
 * @event 
 * @description Event fired when the service response arrives, before processing the response body
 * @param {XMLHttpRequest} request
 */
aidep.dmap.ItemService.EVENT_REQUEST_END='requestend';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_REQUEST_END);

/**
 * @event 
 * @description Event fired when all of the response's map items has been processed
 * @param {XMLHttpRequest} request
 */
aidep.dmap.ItemService.EVENT_RESPONSE_PROCESSED='responseprocessed';
ITEM_SVC_EVENT_NAMES.push(aidep.dmap.ItemService.EVENT_RESPONSE_PROCESSED);

/**
 * Add a listener for a specific event.
 * @param {String} evt event to listen for
 * @param {Function} listener function to invoke when the event happens
 */
aidep.dmap.ItemService.prototype.addEventListener=function(evt,listener) {
	this.events.addEventListener(evt,listener);
	
	if((evt==ItemService.EVENT_ITEM_ADDED || evt==ItemService.EVENT_ITEM_DATA_UPDATED) && Util.hasKeys(this.items)) {
		// notify of existing items
		var items=[];
		for(var key in this.items) {
			items.push(this.items[key]);
		}
		listener.apply(this, [items]);
	}
};

/**
 * Remove an existing listener for a specific event.  Caller of #addEventListener must track the function instance 
 * to remove it.
 * 
 * @param {String} evt event to listen for
 * @param {Function} listener function to invoke when the event happens
 * @return true if the listener was successfully removed
 */
aidep.dmap.ItemService.prototype.removeEventListener=function(evt,listener){
	return this.events.removeEventListener(evt,listener);
};

aidep.dmap.ItemService.prototype.getRequestHandler=function() {
	return this.requestHandler;
};

aidep.dmap.ItemService.prototype.setRequestHandler=function(requestHandler) {
	this.requestHandler = requestHandler;
};

/**
 * get the map that this service is associated with
 * @returns {aidep.dmap.Map} 
 */
aidep.dmap.ItemService.prototype.getMap=function() {
	return this.map;
};

/**
 * Get the current items this service knows about.
 * @returns {Array} Array of {aidep.dmap.Item} 
 */
aidep.dmap.ItemService.prototype.getItems=function() {
	var items = [];
	for(var key in this.items) {
		items.push(this.items[key]);
	}
	return items;
};


/**
 * Add an array of Items to display on the Map.
 * @param {Array} items array of Items to be added.  If the Items do not have all the item data needed, the #makeRequest is 
 * required.  If Item with the same type and id already exists, the existing Item's data is updated with the Item from 
 * the parameter, and the parameters Item is replaced in the Array.
 */
aidep.dmap.ItemService.prototype.addItems=function(/*Array<Item>*/items) {
	var itemsAdded=[], itemsRemoved = [];
	for(var idx in this.items){
		
		var hotelId = this.items[idx];
		if(!checkExistsItem(hotelId)){
			itemsRemoved.push(hotelId);
			delete this.items[idx];
		}
	}

	if(itemsRemoved.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_REMOVED, [itemsRemoved]);
	}
	
	for(var idx=0; idx<items.length;idx++) {
		var item=items[idx],
			id=item.getType()+"."+item.getId(),
			itemExist=this.items[id];
		if(itemExist) {
			Util.merge(itemExist,item);
			items[idx]=itemExist; // update the IN to expose existing Item
		} else {
			this.items[id]=item;
			itemsAdded.push(item);
		}
	}
	if(itemsAdded.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_ADDED, [itemsAdded]);
	}
	if(items.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_DATA_UPDATED, [items]);
	}
	
	function checkExistsItem(item){
		for(var newIdx=0; newIdx<items.length; newIdx++){
			if(items[newIdx] == item){
				return true;
			}
			
		}
		
		return false;
	}
	
};

/**
 * Remove Items from the Map. These may have been added by addItems or by requestItems.  Items are matched on #type and #id
 * @param {Array} items array of {aidep.dmap.Item} to remove.  Matches just the type and id, so it doesn't need to be the same instance of Item.
 * @return {Array} actual items removed.s
 */
aidep.dmap.ItemService.prototype.removeItems=function(/*Array<Item>*/items) {
	var itemsRemoved=[];
	for(var idx=0; idx<items.length;idx++) {
		var item=items[idx],
			id=item.getType()+"."+item.getId();
		item=this.items[id];
		if(item)
			itemsRemoved.push(item);
		delete this.items[id];
	}
	this.boundsWithExtraRequested=[];
	if(itemsRemoved.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_REMOVED, [itemsRemoved]);
	}
	return itemsRemoved;
};

/**
 * Remove all items from the map.
 * @return {Array} actual items removed
 */
aidep.dmap.ItemService.prototype.clearItems=function() {
	var itemsRemoved=[],
		items=this.items;
	this.items={};
	for(var id in items) {
		itemsRemoved.push(items[id]);
	}
	this.boundsWithExtraRequested=[];
	if(itemsRemoved.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_REMOVED, [itemsRemoved]);
	}
	return itemsRemoved;
};

/**
 * Retain all items already retrieved within a given bounds.  Remove all others
 * @param bounds the bounds to keep.  Defaults to last requested bounds, or if no requests, the viewable area of the map.
 */
aidep.dmap.ItemService.prototype.retainItemsInBounds=function(bounds){
	var itemsRemoved=[];
	if(!bounds) {
		if(this.boundsWithExtraRequested.length > 0) {
			bounds=this.lastBoundsWithExtra;
		} else {
			bounds=this.map.getBounds();
		}
	}
	
	for(var key in this.items) {
		var item=this.items[key]||{},
			lls = item.getLatLongs() || [],
			contains=false;
		for(var idx=0; idx < lls.length && !contains; idx++) {
			contains=bounds.contains(lls[idx]);
		}
		if(!contains) {
			itemsRemoved.push(item);
			delete this.items[key];
		}
	}

	this.boundsWithExtraRequested=[];
	if(itemsRemoved.length > 0) {
		this.events.fireEvent(ItemService.EVENT_ITEM_REMOVED, [itemsRemoved]);
	}
};

/**
 * Lookup items that meet the desired criteria.  This method requires #makeRequests be called.
 * Add listener for #EVENT_ITEM_ADDED to get the results if necessary.
 * Supported key/values:
 * geoEXPE : 'POI'
 * hotels  : {aidep.dmap.HotelItemsRequest}
 * @param {Object} items key/value pairs of items to request
 */
aidep.dmap.ItemService.prototype.addItemsRequest=function(/*Map<String,Object>*/items) {
	Util.merge(this.itemRequests, items);
};

/**
 * Remove all item requests for any future calls.
 */
aidep.dmap.ItemService.prototype.clearItemsRequests=function() {
	this.itemRequests={};
};

/**
 * Fetch additional data about items added by either #addItems or #requestItems.
 * Add listener for #EVENT_ITEM_DATA_UPDATED to get the results if necessary.
 * Supported key/values:
 * Bounds : true - Return Latitude/Longitude for the items
 * Address : true - Return Hotel Address information
 * Rating : true - Return Star and review rating information
 * Image : true - Return Image urls
 * Price : true - Return the avail/price information
 * EanID : true - Return the EANId associated with hotels
 * Size : true - Return the size associated with hotel clusters
 * @param {Object} data key/value pairs of item data to request
 */
aidep.dmap.ItemService.prototype.addItemDataRequest=function(/*Map<String,Object>*/data) {
	Util.merge(this.dataRequests,data);
};

/**
 * Remove all data requests for any future calls
 */
aidep.dmap.ItemService.prototype.clearItemDataRequests=function() {
	this.dataRequests={'Bounds':true};
};

/**
 * Make the server call to provide data to #requestItems and #requestItemData.  This call returns immediately.  
 * This method is called automatically as the user zooms or pans in order to get more data.
 * @see #addItemsRequest
 * @see #addItemDataRequest
 */
aidep.dmap.ItemService.prototype.makeRequests=function() {

	if(!Util.hasKeys(this.itemRequests) || !_.isEmpty(App.nautilusHotels) || isSearchInProgress) {
    return; // NOOP
  }

	var svc = this,
      map = this.map,
      center = map.getCenter(),
      wpx = map.getConfiguration().width,
      hpx = map.getConfiguration().height,
      z = map.getZoom(),
      reqHotels = this.itemRequests['hotels'],
      bounds,
      filterStarRating,
      filterPrice,
      filterBrand,
      filterName,
      filterAmenityIds = null;

  // provider, container, etc hasn't been created, and we were not sufficiently configured. Can't do anything.
	if(!wpx || !hpx) {
		return;
	}

  isSearchInProgress = true;
  svc.clearItems();

  if (!doNotClearMapMarkers) {
    App.searchView.removeAllItemsFromMap();
  }

  App.listView.collection.reset();
  doNotClearMapMarkers = false;

  $("#div_listCount").text(getLocalizedString('hotel-finder.loading'));
  $('#div_sort').hide();
  $("#div_priceUpdateNotice").hide();

	if(wpx && hpx && center && z) { 
		/* don't use the MapImpl bounds because we may not have MapImpl yet, and depending on which event triggers this 
			method, bounds may be out of sync with center or zoom to be used */
    bounds = center.getBoundsFromDisplayable(hpx, wpx, z);
	}


  if (reqHotels && reqHotels.price && reqHotels.price.min) {
    filterPrice = reqHotels.price.min + ',' + reqHotels.price.max || '';
  }

  // Star rating
  if (reqHotels && reqHotels.star && reqHotels.star.min != undefined && reqHotels.star.max != undefined) {
    var min = parseInt(reqHotels.star.min),
        max = parseInt(reqHotels.star.max),
        starValues = [];

		// If min and max === 0, there is no star filter set
		if (!(min == 0 && max == 0)) {

			if (min < 1) {
				min = 1;
			}
			if (max > 5) {
				max = 5;
			}

			for (var i = min; i <= max; i++) {
				starValues.push(i.toString());
			}

			filterStarRating = starValues.join();
		}
  }

  if (reqHotels && reqHotels.brand) {
    filterBrand = reqHotels.brand;
  }

  if (reqHotels && reqHotels.name) {
    filterName = reqHotels.name;
  }

  // Return a string of comma seperated ids
  if (reqHotels && reqHotels.amenityids) {
    filterAmenityIds = reqHotels.amenityids.join();
  }


  var viewport;

  if (bounds) {
    viewport =  bounds.sw.lat + ',' +
                bounds.sw.lng + ',' +
                bounds.ne.lat + ',' +
                bounds.ne.lng;
  }

  var searchParams = {
		query: App.searchView.getUserQuery(),
    viewport: viewport,
    amenities: filterAmenityIds,
    starRating: filterStarRating,
    name: filterName,
    price: filterPrice,
    zoom: zoom
  };

  App.Services.HotelSearch.getResults(searchParams, false, function (err, result) {
    svc.events.fireEvent(ItemService.EVENT_REQUEST_END, []);

    // Error, sending an empty list will reset side bar
    if (err || result === undefined) {
      App.searchView.addAllItemsToListView([]);
      return;
    }

    var parse = result.PARSE;

    if (parse && parse.HOTELS) {
			if (!_.isEmpty(parse.HOTEL_PARTIALS)) {
				var hotels = parse.HOTELS.concat({}).concat(parse.HOTEL_PARTIALS);
				App.searchView.addAllItemsToListView(hotels, true);
			}
			else {
				App.searchView.addAllItemsToListView(parse.HOTELS);
			}
    }
    else if (parse && parse.CLUSTERS) {
      App.searchView.addAllItemsToListView(parse.CLUSTERS);
    }
    else {
      App.searchView.addAllItemsToListView([]);
    }

    // Place exact POI match marker
    if(parse && parse.TYPE === 'POI') {
      App.searchView.putPOIMarkerOnMap(_.first(parse.POIS), 'poiMarkerSpecial');
    }

    // Place additional POI markers on the map
    if (parse && parse.POIS) {
      App.searchView.putAllPOIMarkersOnMap(parse.POIS);
    }


    svc.events.fireEvent(ItemService.EVENT_RESPONSE_PROCESSED, []);
  });

  svc.events.fireEvent(ItemService.EVENT_REQUEST_START, []);
};



/**
 * Convert a JSON Item to {aidep.dmap.Item}
 * @param {Object} items associative array tracking existing items (in/out)
 * @param {Object} itemJSON JSON representation of an {aidep.dmap.Item}
 * @returns {aidep.dmap.Item}
 */
function parseJSONItem(items, itemJSON) {
	var key=itemJSON.Type+'.'+itemJSON.Id,
		item = items[key],
		llsJSON=itemJSON.Border,
		lls=[];
	if(!item)
		item = new Item(itemJSON.Type,itemJSON.Id);
	if(llsJSON) {
		 if(!llsJSON.length) llsJSON=[llsJSON]; // JSON array normalization
		 for(var idx in llsJSON) {
			 var llJSON=llsJSON[idx];
			 lls.push(new LatLong(llJSON.Lat,llJSON.Lng));
		 }
		 item.setLatLongs(lls);
	}
	// is JSON representation the right representation
	Util.merge(item.getData(),itemJSON);
	return item;
};

/**
 * Convert Bounds to url representation
 * @param {aidep.dmap.Bounds} b
 * @returns {String} url representation "north,east,south,west"
 */
function boundsToParam(b, c, z) {
	var ne=b.getNorthEast(),
		sw=b.getSouthWest();
	
	if(z == 2){
		var newSw = new aidep.dmap.LatLong(-45, -160);
		var newNe = new aidep.dmap.LatLong(65, 160);
		b.setNorthEast(newNe);
		b.setSouthWest(newSw);
		return '65,160,-45,-160';
	}

	return ne.getLat().toFixed(6)+','+ne.getLong().toFixed(6)+','+sw.getLat().toFixed(6)+','+sw.getLong().toFixed(6);
}

/**
 * Convert LatLong to url representation
 * @param {aidep.dmap.LatLong} ll
 * @returns {String} url representation "lat,lng"
 */
function latLongToParam(ll) {
	return ll.getLat().toFixed(6)+','+ll.getLong().toFixed(6);
}

/**
 * Convert Date to ISO Date format without time
 * @param {Date} d
 * @returns {String}
 */
function dateToISODate(d) {
	return d.getFullYear()+'-'+(1+d.getMonth())+'-'+d.getDate();
};

/**
 * Register events with the map to update data on pan/zoom
 * @param {aidep.dmap.Map} map
 * @param {aidep.dmap.ItemService} svc
 */
function addMapListeners(map, svc) {
	var fn=function() {
		if(svc.getRequestHandler() != null){
			clearTimeout(svc.getRequestHandler());
		}
		svc.setRequestHandler(setTimeout(function(){
			svc.makeRequests();
		},500));
		
	};
	// Need to fully qualify Map b/c it gets loaded after this js
	//map.addEventListener(aidep.dmap.Map.EVENT_ZOOM_CHANGED,fn);
	//map.addEventListener(aidep.dmap.Map.EVENT_CENTER_CHANGED,fn);
	//map.addEventListener(aidep.dmap.Map.EVENT_BOUNDS_CHANGED,fn);
	map.addEventListener(aidep.dmap.Map.EVENT_IDLE,fn);
};

