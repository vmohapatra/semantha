var Util=aidep.dmap.common.Utilities,
	Map=aidep.dmap.google.Map,//import
	Events=aidep.dmap.common.Events,
	CONTENT_EVENT_NAMES=[],
	CONTENT_EVENT_HANDLERS={},
	Content,
	tracker={};
Util.namespace("aidep.dmap.google");

/**
 * @namespace Content
 * @description Content is a container for map markers and info boxes to be added to a Map.  Content interacts with the Map, so if the Map is not yet initialized (still loading google.maps), some getters of Content may not be available.  All setters will delay their action until the Map is available.
 * @param {aidep.dmap.google.Map} map map to display in.
 * @param {aidep.dmap.LatLong} position position to center the Content
 * @param {aidep.dmap.google.Content.Configuration} opts the properties to apply this content.  Accepts associative-array instead of {aidep.dmap.google.Content.Configuration}
 */
aidep.dmap.google.Content = function(map, position, opts) {
	this.events=new Events(this, CONTENT_EVENT_NAMES, CONTENT_EVENT_HANDLERS);
	this.map=map;
	this.position=position;
	this.opts=opts;
	
	var content=this;
	map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		if(!GoogleContent.prototype.setMap) {
			// delay the inheritance until we know we have OverlayView available.
			var prototype=GoogleContent.prototype;
			GoogleContent.prototype=new google.maps.OverlayView();
			Util.merge(GoogleContent.prototype,prototype);
		}
		
		content.impl=new GoogleContent(map,position,new Events(content, ['onAdd','onRemove']),opts);
	});
	// register event handlers
	if(opts.events) {
		for(var event in opts.events) {
			content.addEventListener(event, opts.events[event]);
		}
	}
};
Content=aidep.dmap.google.Content;//shorthand


/**
 * @namespace Configuration properties for aidep.dmap.google.Map constructor.
 * 
 * @property {Object} alignment x and y alignment, where the value of x and y are which direction should the position/latlong be from closest edge of the Content x:'left'|'center'|'right' y:'top','center','bottom'. Default is {x:'right',y:'bottom'}.  Default is best performance.  If you know the height and width of the content area, it is best to use CSS class with position:absolute, top, left to control position.
 * @property {String} className css class names to apply to the div.  Note that you can also apply the classes directly to the node(s) in content.  Optional
 * @property {String} content html content of the Content.  Also accepts Node.  Required
 * @property {Object} events Associative Array of Event name to event function.  This allows early registration of the events before content is available on the page.
 * @property {String} id html id to assign to the Element.  Optional
 * @property {Object} offset x and y offset (in pixels) to move the closest corner from the anchor Item or LatLong 
 * @property {aidep.dmap.google.Content.Configuration} shadow.  The configuration to be used as shadow of this Content.  Shadow's are in effect a second Content that is automatically generated relative to this Content.  All properties except id and content will inherit from this Configuration if not set.
 * @property {Object} style style to apply to the div. It is recommended to use className instead to centrally manage all the display properties via css.  Optional
 * 
 * @param {Object} opts initial configuration
 */
aidep.dmap.google.Content.Configuration=function(opts) {
	opts=opts||{};
	this.alignment=opts.alignment;
	this.className=opts.className;
	this.content=opts.content;
	this.events=opts.events;
	this.id=opts.id;
	this.offset=opts.offset;
	this.shadow=opts.shadow;
	this.style=opts.style;
};

/**
 * Align the content so that it is centered on the position.  Applies to the x or y alignment.  offset ignored in the centered direction.
 * 
 * new aidep.dmap.google.Content({...,align:{x:{'center'},y:'center'}});
 */
aidep.dmap.google.Content.ALIGN_CENTER='center';

/**
 * Align the content so that the bottom edge is facing the position.  Applies to the y alignment.  offset.y moves the content up the page.
 * 
 * new aidep.dmap.google.Content({...,align:{x:...,y:'top'}});
 */
aidep.dmap.google.Content.ALIGN_TOP='top';

/**
 * Align the content so that the bottom edge is facing the position.  Applies to the y alignment.  offset.y moves the content down the page.
 * 
 * new aidep.dmap.google.Content({...,align:{x:{'center'},y:'center'}});
 */
aidep.dmap.google.Content.ALIGN_BOTTOM='bottom';

/**
 * Align the content so that the left edge is facing the position.  Applies to the x alignment.  offset.x moves the content to the right.
 * 
 * new aidep.dmap.google.Content({...,align:{x:{'right'},y:...}});
 */
aidep.dmap.google.Content.ALIGN_RIGHT='right';

/**
 * Align the content so that the right edge is facing the position.  Applies to the x alignment.  offset.x moves the content to the left.
 * 
 * new aidep.dmap.google.Content({...,align:{x:{'left'},y:...}});
 */
aidep.dmap.google.Content.ALIGN_LEFT='left';

/**
 * @event
 * @description fired when a Content is removed from the map by #remove
 */
aidep.dmap.google.Content.EVENT_REMOVED='removed';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_REMOVED);

/**
 * @event
 * @description fired when a Content #setOptions is called
 * @param {aidep.dmap.google.Content.Configuration} optsOld old configuration
 * @param {Object} optsNew changing configuration as passed to #setOptions
 */
aidep.dmap.google.Content.EVENT_CONTENT_CHANGED='content_changed';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_CONTENT_CHANGED);

/**
 * @event
 * @description fired when a Content #setPosition is called
 * @param {aidep.dmap.LatLong} position
 * @param {Object} optsNew changing configuration as passed to #setOptions
 */
aidep.dmap.google.Content.EVENT_POSITION_CHANGED='position_changed';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_POSITION_CHANGED);

/**
 * @event
 * @description fired when mouse is clicked within the content
 * @param {MouseEvent} Mouse event
 */
aidep.dmap.google.Content.EVENT_MOUSE_CLICK='click';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_MOUSE_CLICK);


/**
 * @event
 * @description fired when mouse enters the content
 * @param {MouseEvent} Mouse event
 */
aidep.dmap.google.Content.EVENT_MOUSE_ENTER='mouse_enter';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_MOUSE_ENTER);

/**
 * @event
 * @description fired when mouse exits the content
 * @param {MouseEvent} Mouse event
 */
aidep.dmap.google.Content.EVENT_MOUSE_EXIT='mouse_exit';
CONTENT_EVENT_NAMES.push(aidep.dmap.google.Content.EVENT_MOUSE_EXIT);

function createMouseHandler(evte, evtd) {
	CONTENT_EVENT_HANDLERS[evte]=function() {
		var content=this,
			listener=function() {
				content.events.fireEvent(evte,arguments);
			};
		content.map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
			if(content.impl.divContent) {
				Util.addEventListener(content.impl.divContent,evtd,listener);
			} else { // delay fire
				content.impl.events.addEventListener('onAdd',function() {
					Util.addEventListener(content.impl.divContent,evtd,listener);
					content.impl.events.removeEventListener('onAdd',arguments.callee);
				});
			}
			
		});
	};
};

createMouseHandler(aidep.dmap.google.Content.EVENT_MOUSE_CLICK, 'click');
createMouseHandler(aidep.dmap.google.Content.EVENT_MOUSE_ENTER, 'mouseover');
createMouseHandler(aidep.dmap.google.Content.EVENT_MOUSE_EXIT, 'mouseout');

/**
 * This is a static helper method to register listeners that add Content (marker or InfoBox) to the map.  Automatically adds #trackItemsRemove.
 * @static
 * @param {aidep.dmap.ItemService} svc the ItemService that is handling items
 * @param {aidep.dmap.google.Content.Configuration} opts configuration for each Content
 * @param {Function} transform optional function to transform the content for the item being shown.  function({aidep.dmap.google.Map} map, {aidep.dmap.Item} item, {aidep.dmap.google.Content} content)
 */
aidep.dmap.google.Content.trackItems=function(svc, opts, transform){
	var map=svc.getMap();
	svc.addEventListener(aidep.dmap.ItemService.EVENT_ITEM_DATA_UPDATED, function(items) {
		for(var idx in items) {
			var item=items[idx],
				key=item.getType()+"."+item.getId(),
				content=tracker[key],
				position=item.getLatLong();
			if(position) {
				if(!content) {
					tracker[key]=new Content(map, position, opts);
					content=tracker[key];
					content.setItem(item);
				}
				if(transform) {
					transform(map, item, content);
				}
				content.setPosition(position);
			}
		} 
	});
	svc.addEventListener(aidep.dmap.ItemService.EVENT_ITEM_REMOVED, function(items) {
		for(var idx in items) {
			var item=items[idx],
				key=item.getType()+"."+item.getId(),
				content=tracker[key];
			if(content) {
				content.remove();
				delete tracker[key];
			}
		}
	});
};

/**
 * Static helper transform function for #trackItems to layer the items on the map by setting the z-index based on the Latitude
 * 
 * @static
 * @param {aidep.dmap.Map} map
 * @param {aidep.dmap.Item} item
 * @param {aidep.dmap.google.Content} content
 */
aidep.dmap.google.Content.transformLayerZIndex=function(map,item,content) {
	var z=90-item.getLatLong().getLat();
	z*=500000;
	content.setOptions({style:{zIndex: z.toFixed(0) }});
};

/**
 * Add a listener for a specific event.
 * @param {String} evt event to listen for
 * @param {Function} listener function to invoke when the event happens
 */
aidep.dmap.google.Content.prototype.addEventListener=function(evt,listener) {
	this.events.addEventListener(evt,listener);
};

/**
 * Remove an existing listener for a specific event.  Caller of #addEventListener must track the function instance 
 * to remove it.
 * 
 * @param {String} evt event to listen for
 * @param {Function} listener function to invoke when the event happens
 * @return true if the listener was successfully removed
 */
aidep.dmap.google.Content.prototype.removeEventListener=function(evt,listener){
	return this.events.removeEventListener(evt,listener);
};

/**
 * Set the current options.  This supports a partial update.  Any keys not mentioned in opts are not updated.  Changes to 'events' is ignored on an update.  If you need to update the events, use #addEventListener and #removeEventListener instead
 * 
 * @param {aidep.dmap.google.Content.Configuration} opts
 */
aidep.dmap.google.Content.prototype.setOptions=function(opts) {
	var content=this,
		optsOld = content.opts,
		optsNew = {};
	// merge existing and new settings 
	Util.merge(optsNew, optsOld); 
	Util.merge(optsNew, opts);
	content.opts=optsNew;
	
	content.map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		content.impl.setOptions(optsNew);
		content.events.fireEvent(Content.EVENT_CONTENT_CHANGED, [optsOld, opts]);
	});
};

/**
 * Get the current options (or null if content is not yet finished initializing)
 * @return {aidep.dmap.google.Content.Configuration}
 */
aidep.dmap.google.Content.prototype.getOptions=function() {
	return this.opts;
};

/**
 * Set the current position
 * 
 * @param position
 */
aidep.dmap.google.Content.prototype.setPosition=function(position) {
	var content=this;
	content.position=position;
	content.map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		if(content.impl.getPosition()!==position) {
			content.impl.setPosition(position);
			content.events.fireEvent(Content.EVENT_POSITION_CHANGED, []);
		}
	});
};

/**
 * Get the current position (or null if the content hasn't finished initializing)
 * @returns {aidep.dmap.LatLong} position
 */
aidep.dmap.google.Content.prototype.getPosition=function() {
	return this.position;
};

/**
 * Get the item associated with this Content
 * @returns {aidep.dmap.Item}
 */
aidep.dmap.google.Content.prototype.getItem=function() {
	return this.item;
};

/**
 * Set the Item related to this Content
 * @param {aidep.dmap.Item} item
 */
aidep.dmap.google.Content.prototype.setItem=function(item) {
	this.item=item;
};


/**
 * Remove the Content from the map.
 */
aidep.dmap.google.Content.prototype.remove=function() {
	var content=this;
	content.map.addEventListener(Map.EVENT_MAP_PROVIDER_LOADED, function() {
		content.impl.setMap(null);
		content.events.fireEvent(Content.EVENT_REMOVED, []);
	});
};



/**
 * Internal implementation of the Content to keep the external representation free of any google apis.
 * 
 * @param {aidep.dmap.google.Map} map
 * @param {aidep.dmap.LatLong} position
 * @param {aidep.dmap.common.Events} events the events to notify onAdd and onRemove 
 * @param {aidep.dmap.google.Content.Configuration} opts
 */
function GoogleContent (map, position, events, opts)
{
	google.maps.OverlayView.apply(this, []); // super(...)
	this.opts=opts;
	this.position=position;
	this.events=events;
	this.setMap(map.getMapProvider());
};

GoogleContent.prototype.onRemove = function() {
	if(this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div=null;
		this.divContent=null;
	}
	if(this.divShadow) {
		this.divShadow.parentNode.removeChild(this.divShadow);
		this.divShadow=null;
		this.divShadowContent=null;
	}
	this.events.fireEvent('onRemove',[]);
};

function applyOpts(gc, opts) {

	gc.opts=opts;
	if(gc.div) {
		gc.div.style.visibility='hidden';// hide until we can apply position
		applyStyleToDiv(gc.divContent, opts);
		applyContentToDiv(gc.divContent, opts);
	}
	if(gc.divShadow) {
		gc.divShadow.style.visibility='hidden';// hide until we can apply position
		gc.divShadow.style.position='absolute';
		
		// apply both regular and shadow styles.
		applyStyleToDiv(gc.divShadowContent, opts);
		applyStyleToDiv(gc.divShadowContent, opts.shadow);
		//gc.divShadow.style.display='';
		// but only apply content from shadow
		applyContentToDiv(gc.divShadowContent, opts.shadow);
	}
};

function applyStyleToDiv(div, opts) {
	if(opts.style)
		Util.merge(div.style,opts.style);
	
	if(opts.className)
		div.className=opts.className;
};

function applyContentToDiv(div, opts, paneDefault) {
	var content=opts.content||"";
	
	if(opts.id)
		div.id=opts.id;
	
	// handle content last
	if(!content.nodeType) { // is a String
		div.innerHTML=content;
	} else {
		if(content.parentElement) // already associated, consider it a template
			content=content.cloneNode(true);
		div.innerHTML="";// clear anything already attached to this node
		div.appendChild(content);
	}
};

GoogleContent.prototype.setPosition=function(position) {
	this.position=position;
	if(position) {
		if(this.drawn) { // we've already drawn
			this.draw();
		}
	} else {
		// this would be better as display='none', but since we are already changing visibility, using that instead.
		this.div.style.visibility='hidden';
	}
};

GoogleContent.prototype.getPosition=function() {
	return this.position;
};

GoogleContent.prototype.setOptions=function(opts) {
	this.opts=opts;
	if(this.div) {
		this.onAdd(); // redo add incase
		if(this.drawn) {
			this.draw();//redo draw
		}
	}
};

GoogleContent.prototype.getOptions=function() {
	return this.opts;
};

GoogleContent.prototype.onAdd = function() {
	if(!this.div) {
		createDiv(this, 'div','divContent');
	}
	if(!this.divShadow && this.opts.shadow) {
		createDiv(this, 'divShadow','divShadowContent');
	}
	applyOpts(this, this.opts);
	this.events.fireEvent('onAdd',[]);
};

function createDiv(context, key, keyContent) {
	context[key]=document.createElement('div');
	context[keyContent]=document.createElement('div');
	context[key].appendChild(context[keyContent]);
	context[key].style.position='absolute';
}

GoogleContent.prototype.draw = function() {
	this.drawn=true;
	if(!this.position) {
		return;
	}
	
	var opts=this.opts,
      div=this.div,
      divShadow=this.divShadow,
      shadow=opts.shadow,
      ll = new google.maps.LatLng(this.position.getLat(),this.position.getLong()),
      proj = this.getProjection(),
      p = proj.fromLatLngToDivPixel(ll),
      align=opts.alignment||{},
      offset=opts.offset||{},
      pane=opts.pane;
		
	if(!div)
		throw new Error("draw called without add");
	if(!div.parentElement) {
		if(!pane) {
			pane=opts.content?"floatPane":"overlayImage";
		}
		this.getPanes()[pane].appendChild(div);
	}
	setDivLocation(div,this.divContent,p,align,offset);

  // Set the aggregation marker styles after the item is drawn on the map
  var clusterItem = App.listView.collection.findWhere({'itemId': this.divContent.id});
  if (clusterItem != undefined) {
    aggregationMapMarkerStyler(clusterItem, map);
  }

	
	if(this.divShadow) {
		if(!this.divShadow.parentElement) {
			pane=shadow.pane;
			if(!pane) {
				pane=opts.content?"floatShadow":"overlayShadow";
			}
			this.getPanes()[pane].appendChild(divShadow);
		}
		setDivLocation(divShadow,this.divShadowContent,p,shadow.alignment||align,shadow.offset||offset);
	}


};

function setDivLocation(div,divContent,p,align,offset) {
	var x=p.x,y=p.y,
		offsetX,offsetY;
	// TODO auto alignment support

	// Depending on render timing, offsetWidth/offsetHeight may not be determined for the outer div.
	// if 0, then use the contentDiv instead.
	switch(align.x||Content.ALIGN_RIGHT) {
	case Content.ALIGN_LEFT:
		offsetX=div.offsetWidth||divContent.offsetWidth;
		x += -offsetX - (offset.x||0);
		break;
	case Content.ALIGN_CENTER:
		offsetX=div.offsetWidth||divContent.offsetWidth;
		x += -offsetX/2; // offset.x ignored
		break;
	case Content.ALIGN_RIGHT:
		x += (offset.x||0);
		break;
	default:
		throw new Error("Unknown x alignment: "+alignment.x);
	}
	switch(align.y||Content.ALIGN_BOTTOM) {
	case Content.ALIGN_TOP:
		offsetY=div.offsetHeight||divContent.offsetHeight;
		y += -offsetY - (offset.y||0);
		break;
	case Content.ALIGN_CENTER:
		offsetY=div.offsetHeight||divContent.offsetHeight;
		y += -offsetY/2; // offset.y ignored
		break;
	case Content.ALIGN_BOTTOM:
		y += (offset.y||0);
		break;
	default:
		throw new Error("Unknown y alignment: "+alignment.y);
	}

	div.style.left = x + "px";
	div.style.top = y + "px";
	div.style.visibility = '';
}
