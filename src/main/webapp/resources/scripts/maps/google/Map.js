var 
	Item=aidep.dmap.Item,//import
	Bounds=aidep.dmap.Bounds,//import
	LatLong=aidep.dmap.LatLong,//import
	LatLongImpl,// delay import
	MapImpl,//delay import
	Util=aidep.dmap.common.Utilities,
	MAP_EVENT_NAMES=[],
	MAP_EVENT_HANDLERS={},
	Map,
	s_googleChannel,
	GOOGLE_CLIENT_ID='gme-aidep',
	GOOGLE_VERSION='3.9',
	TIMER={
		poll:50, // check every 50ms
		timeout:30000 // stop checking after 30 seconds
	};

Util.namespace("aidep.dmap.google");

function initProvider() {
	var scripts=document.getElementsByTagName('script'),
		scriptUrl=scripts[scripts.length-1].src,
		parseChannel=/\?.*?[&]?channel=([a-zA-Z0-9\-\.]*)/.exec(scriptUrl),
		parseHost=/\?.*?[&]?host=([a-zA-Z0-9:\-\.]*)/.exec(scriptUrl),
        parseProtocol=/\?.*?[&]?protocol=([a-zA-Z]*)/.exec(scriptUrl),
		url="http://maps.googleapis.com/maps/api/js?sensor=true&v="+GOOGLE_VERSION;
	if(!parseChannel)
		throw new Error("channel not specified on javascript tag '"+scriptUrl+"'");
	if(parseHost && parseProtocol && aidep.dmap.ItemService)
		aidep.dmap.ItemService.setServiceUrl(parseProtocol[1] + "://" + parseHost[1]);
	s_googleChannel=parseChannel[1];
	if(!window.google) {
		// googleClient=false is a cheat to bypass the host verification of gme-aidep for testing, since IP and hosts aren't alll part of the whitelisted sitess
		if(!/\?.*?[&]?googleClient=false/.exec(window.location))
			url+="&client="+GOOGLE_CLIENT_ID+"&channel="+s_googleChannel;
		Util.addJS(url);
	}
}
initProvider();

/**
 * @namespace implementation of Dynamic Map API that uses Google Maps.  
 * @param {Node} container owning div.  Also supports {String} as the ID of the div, which can be used prior to the 'load' event.
 * @param {aidep.dmap.google.Map.Configuration} config Configuration to initialize with.  Map supports passing a regular {Object} with the same property names as {aidep.dmap.google.Map.Configuration}.
 * @Author Sven Zethelius
 */
aidep.dmap.google.Map=function(container,config){
	this.container=null;
	this.provider=null; // provider is delay s_loaded
	this.events=new aidep.dmap.common.Events(this, MAP_EVENT_NAMES, MAP_EVENT_HANDLERS);
	
	this.config=new Map.Configuration(config);
	
	var map=this,
		timerTimeout=setTimeout(function() {
			timerTimeout=null;
			throw new Error("Unable to load map in a reasonable time.");
		},TIMER.timeout),
		timerInit=null,
		fnInit=function(first) {
			var fn=arguments.callee;
			if(beforeInit(map, container)) {
				clearTimeout(timerTimeout);
				clearTimeout(timerInit);
				if(window.removeEventListener)
					window.removeEventListener('load',fn);
				initMapProvider(map);
			} else {
				timerInit=setTimeout(function() {fn('timer');},TIMER.poll);
				if(first==true && window.addEventListener)
					window.addEventListener('load',fn);
			}
		};
	fnInit(true);
};
Map=aidep.dmap.google.Map; // short name

/**
 * @namespace Configuration properties for aidep.dmap.google.Map constructor.
 * @property {aidep.dmap.LatLong} center the initial center of the map. This can also be an {aidep.dmap.Item} if the item should be used as the center.  For best performance, the {aidep.dmap.LatLong} of the Item should be specified, but the map will support resolving the LatLong as needed.
 * @property {Number} height height of the container.  If set, changes the container's height.  Default:container's existing hieght.
 * @property {Number} width width of the container.  If set, changes the container's width.  Default:container's existing width.
 * @property {Number} zoom initial zoom level 1-21.  Default:12
 * @property {Number} zoomMin minimum zoom level.  Default:1
 * @property {Number} zoomMax maximum zoom level.  Default:21
 * @param {Object} config initial configuration
 */
aidep.dmap.google.Map.Configuration=function(config) {
	config=config||{};
	this.center=config.center;
	this.height=config.height;
	this.width=config.width;
	this.zoomMin=Math.min(21,Math.max(1,config.zoomMin||1));
	this.zoomMax=Math.min(21,Math.max(this.zoomMin,config.zoomMax||21));
	this.zoom=Math.min(this.zoomMax,Math.max(this.zoomMin,config.zoom||12));
	this.mapStyle=config.styles;
	this.zoomControlOpts=config.zoomControlOptions;
	this.showPanControl=config.panControl;
	this.panControlOpts=config.panControlOptions;
    this.showStreetViewControl=config.streetViewControl;
    this.streetViewControlOpts=config.streetViewControlOptions;
};

// TODO JSDoc cleanup of Event declarations so its understandable
// better description for listener
// TODO customize jsdoc template to better display events
/**
 * @event 
 * @description Event fired when the map provider is loaded
 */
aidep.dmap.google.Map.EVENT_MAP_PROVIDER_LOADED='mapproviderloaded';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_MAP_PROVIDER_LOADED);

/**
 * @event
 * @description Event fired when the center of the map is changed, either through #setCenter or via panning.  This event is fired before #EVENT_BOUNDS_CHANGED when the center is changed.
 */
aidep.dmap.google.Map.EVENT_CENTER_CHANGED='centerchanged';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_CENTER_CHANGED);

/**
 * @event
 * @description Event fired when the size of the map has changed.
 */
aidep.dmap.google.Map.EVENT_BOUNDS_CHANGED='boundschanged';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_BOUNDS_CHANGED);

/**
 * @event
 * @description Event fired when the mouse is clicked on the Map, but not on an item.
 * @param {aidep.dmap.LatLong} LatLong the user clicked
 */
aidep.dmap.google.Map.EVENT_CLICK='click';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_CLICK);

/**
 * @event
 * @description Event fired when the mouse is double clicked on the Map, but not on an item.
 * @param {aidep.dmap.LatLong} LatLong the user clicked
 */
aidep.dmap.google.Map.EVENT_DOUBLE_CLICK='dblclick';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_DOUBLE_CLICK);

/**
 * @event
 * @description Event fired when the mouse is moved over the Map
 * @param {aidep.dmap.LatLong} LatLong of current mouse
 */
aidep.dmap.google.Map.EVENT_MOUSE_MOVE='mousemove';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_MOUSE_MOVE);

/**
 * @event
 * @description Event fired when the mouse leaves the Map
 * @param {aidep.dmap.LatLong} LatLong of the current mouse
 */
aidep.dmap.google.Map.EVENT_MOUSE_OUT='mouseout';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_MOUSE_OUT);

/**
 * @event
 * @description Event fired when the mouse enters the Map area
 * @param {aidep.dmap.LatLong} LatLong of the current mouse
 */
aidep.dmap.google.Map.EVENT_MOUSE_OVER='mouseover';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_MOUSE_OVER);

/**
 * @event
 * @description Event fired when the zoom level has changed.  This event is fired before #EVENT_BOUNDS_CHANGED when zooming
 */
aidep.dmap.google.Map.EVENT_ZOOM_CHANGED='zoom';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_ZOOM_CHANGED);

/**
 * @event
 * @description Event fired at the end of an update.
 */
aidep.dmap.google.Map.EVENT_IDLE='idle';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_IDLE);
// Bing->viewchangeend

/**
 * @event
 * @description Event fired when new map tiles are loaded.
 */
aidep.dmap.google.Map.EVENT_TILES_LOADED='tilesloaded';
MAP_EVENT_NAMES.push(aidep.dmap.google.Map.EVENT_TILES_LOADED);

/**
 * Add a listener for a specific event.
 * @param {String} evt event to listen for
 * @param {Function} listener function to invoke when the event happens
 */
aidep.dmap.google.Map.prototype.addEventListener=function(evt,listener) {
	if(this.provider!=null && evt==Map.EVENT_MAP_PROVIDER_LOADED) {
		// if they've asked to be invoked after we've loaded, invoke immediately
		listener.apply(this, [this.provider]);
	} else {
		this.events.addEventListener(evt,listener);
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
aidep.dmap.google.Map.prototype.removeEventListener=function(evt,listener){
	return this.events.removeEventListener(evt,listener);
};

/**
 * The current map provider, or null if the provider has not been initialized.  Map provider may be delay 
 * initialized.  If this method returns null, register an event listener for #EVENT_MAP_PROVIDER_LOADED.  Note that
 * this method is a leaky abstraction that will tie you to the particular map provider.
 * @returns {Object} the current map provider instance
 */
aidep.dmap.google.Map.prototype.getMapProvider=function() {
	return this.provider;
};

/**
 * get the Channel that is shared with the provider.  Useful as the client tracking id.
 * @returns {String} the channel
 */
aidep.dmap.google.Map.prototype.getChannel=function() {
	return s_googleChannel;
};

/**
 * Get the configuration used by the map
 * @returns {aidep.dmap.google.Configuration}
 */
aidep.dmap.google.Map.prototype.getConfiguration=function() {
	return this.config;
};

/**
 * Change the center for the map.  
 * @param {aidep.dmap.LatLong} center
 */
aidep.dmap.google.Map.prototype.setCenter=function(/*LatLong*/center) {
	this.config.center=center;
	this.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function(provider) {
		provider.setCenter(new LatLongImpl(center.getLat(),center.getLong()));
	});
};

/**
 * @returns {aidep.dmap.LatLong} return the center latlong if its available.
 */
aidep.dmap.google.Map.prototype.getCenter=function() {
	var c;
	if(this.provider && // provider initialized 
		(c=this.provider.getCenter())) {// center set on provider
		return fromLatLongImpl(c);
	} 
	if(c=this.config.center) {
		if(c instanceof LatLong) {
			return c;
		}
	}
	return null;
};

/**
 * Get the viewable bounds 
 * @returns {aidep.dmap.Bounds} 
 */
aidep.dmap.google.Map.prototype.getBounds=function() {
	var b,c,z,h,w;
	if(this.provider && 
		(b=this.provider.getBounds())) {
		return new Bounds(fromLatLongImpl(b.getNorthEast()), fromLatLongImpl(b.getSouthWest()));
	}
	if((c=this.getCenter()) && (z=this.getZoom()) &&
			(h=this.config.height) && (w=this.config.width)) {
		return c.getBoundsFromDisplayable(h, w, z);
	}
	return null;
};

/**
 * Resize and recenter the map to the requested bounds.  The map actual bounds will be larger than the bounds requested.
 * @param {aidep.dmap.Bounds} bounds the bounds to fit
 */
aidep.dmap.google.Map.prototype.fitBounds=function(bounds) {
	this.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function(provider) {
		provider.fitBounds(new google.maps.LatLngBounds(
				toLatLongImpl(bounds.getSouthWest()),
				toLatLongImpl(bounds.getNorthEast())));
	});
};

/**
 * Set the current zoom level
 * @param {Number} zoom
 */
aidep.dmap.google.Map.prototype.setZoom=function(zoom) {
	// google and bing use the same zoom level metric (expect 0-World), so don't need to abstract zoom
	zoom=Math.min(this.config.zoomMax,Math.max(this.config.zoomMin,zoom));
	this.config.zoom=zoom;
	this.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		this.provider.setZoom(zoom);
	});
};

/**
 * Get the current zoom level 1-24
 * @return {Number} the current zoom level
 */
aidep.dmap.google.Map.prototype.getZoom=function() {
	if(this.provider)
		return this.provider.getZoom();
	else
		return this.config.zoom;
};

/**
 * called before initMapProvider to ensure map container and google.maps is available before attempting to create Map.
 * 
 * @param {aidep.dmap.google.Map} map 
 * @param {String} container
 * @returns {Boolean} true if its ready to initialize, false otherwise.
 */
function beforeInit(map, container) {
	if(!window.google || !google.maps || !google.maps.Map)
		return false; // google hasn't loaded
	
	if(!map.container) {
		if(container.parentElement)
			map.container=container;
		else
			map.container=document.getElementById(container);
		return map.container!=null;
	}
	return true;
}

/**
 * init the container div, and related configuration
 * @param {aidep.dmap.google.Map} map
 */
function initContainer(map) {
	// if height and width are set, override the div settings
	if(map.config.width && map.config.height) {
		map.container.style.width=''+map.config.width+'px';
		map.container.style.height=''+map.config.height+'px';
	} else {
		map.config.width=map.container.offsetWidth;
		map.config.height=map.container.offsetHeight;
	}
}

/**
 * @param {aidep.dmap.google.Map} map 
 * @param {String} evte {aidep.dmap.google.Map} event
 * @param {String} evtg {google.maps.Map} event
 * @param {Function} argf function to convert the {google.maps.Map} event arguments to {aidep.dmap.google.Map} event arguments
 * 
 */
function registerGoogleEvent(map,evte,evtg,argf) {
	// delay register any event that requires google until the map provider is initialized so we make sure google is available
	map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		google.maps.event.addListener(map.provider,evtg, function() {
			var args = argf.apply(map,arguments); //
			map.events.fireEvent(evte,args);
		});
	});
};

function convertDefaultArguments() {
	return [];
};
function convertMouseEvents(me) {
	return [fromLatLongImpl(me.latLng)]; 
};
function createMapEventHandler(evte,evtg,argf) {
	MAP_EVENT_HANDLERS[evte]=function(){
		registerGoogleEvent(this,evte,evtg,argf);
	};
};

createMapEventHandler(Map.EVENT_CENTER_CHANGED, 'center_changed', convertDefaultArguments);
createMapEventHandler(Map.EVENT_BOUNDS_CHANGED, 'bounds_changed', convertDefaultArguments);
createMapEventHandler(Map.EVENT_ZOOM_CHANGED,   'zoom_changed',   convertDefaultArguments);
createMapEventHandler(Map.EVENT_IDLE,           'idle',           convertDefaultArguments);
createMapEventHandler(Map.EVENT_TILES_LOADED,   'tilesloaded',    convertDefaultArguments);
createMapEventHandler(Map.EVENT_CLICK,          'click',          convertMouseEvents);
createMapEventHandler(Map.EVENT_DOUBLE_CLICK,   'dblclick',       convertMouseEvents);
createMapEventHandler(Map.EVENT_MOUSE_MOVE,     'mousemove',      convertMouseEvents);
createMapEventHandler(Map.EVENT_MOUSE_OUT,      'mouseout',       convertMouseEvents);
createMapEventHandler(Map.EVENT_MOUSE_OVER,     'mouseover',      convertMouseEvents);

/**
 * create the {google.maps.Map} implementation and wire the necessary event handling.
 * @param map 
 */
function initMapProvider(map) {
	if(map.provider) // oops, we got initialized twice, shouldn't happen
		return;
	MapImpl=google.maps.Map;
	LatLongImpl=google.maps.LatLng;
	var implConfig={
			zoom : map.config.zoom,
			center : toLatLongImpl(map.config.center), 
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			minZoom : map.config.zoomMin,
			maxZoom : map.config.zoomMax,
			scaleControl : true,
			styles: map.config.mapStyle,
			zoomControlOptions: map.config.zoomControlOpts,
			panControl:map.config.showPanControl,
			panControlOptions:map.config.panControlOpts,
            streetViewControl:map.config.showStreetViewControl,
            streetViewControlOptions:map.config.streetViewControlOpts
		};
	
	initContainer(map);

	map.provider=new MapImpl(map.container,implConfig);

	// TODO handle div resizes: google.maps.event.trigger(map, 'resize');
	
	map.events.fireEvent(Map.EVENT_MAP_PROVIDER_LOADED, [map.provider]);
	map.events.clearListeners(Map.EVENT_MAP_PROVIDER_LOADED); // don't keep listener references since this is fired once.
};


/**
 * convert either {aidep.dmap.Item} or {aidep.dmap.LatLong} to a {google.maps.LatLng}
 * @param o 
 * @returns {google.maps.LatLng}
 */
function toLatLongImpl(o) {
	if(o instanceof Item) {
		o=o.getLatLong();
	}
	if(o instanceof Array) {
		if(o.length == 1) 
			o=o[0];
		else {
			// TODO support multi lat/lng region
			return null;
		}
	}
	if(o instanceof LatLong) {
		return new LatLongImpl(o.getLat(),o.getLong());		
	}
	return null;
};
/**
 * Convert {google.maps.LatLng} to {aidep.dmap.LatLong}
 * @param ll
 * @returns {aidep.dmap.LatLong}
 */
function fromLatLongImpl(ll) {
	return new LatLong(ll.lat(),ll.lng());
};



