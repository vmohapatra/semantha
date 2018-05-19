var Util=expedia.dmap.common.Utilities;
Util.namespace("expedia.dmap");

/**
 * @namespace Item represents information about a map element, either a Hotel, Point of Interest, etc.
 * 
 * @param {String} type the type of the item
 * @param {String} id the unique id of the item within its type.
 * @param {Array} lls Array of {expedia.dmap.LatLong}
 * @returns {expedia.dmap.Item}
 */
expedia.dmap.Item=function(type,id,lls) {
	this.type=type;
	this.id=id;
	this.lls=lls;
	this.data={};
};

expedia.dmap.Item.prototype.getType=function() {
	return this.type;
};
expedia.dmap.Item.prototype.getId=function() {
	return this.id;
};

/**
 * @param {Array} lls Array of expedia.dmap.LatLong that represents the border or single point of the item.
 */
expedia.dmap.Item.prototype.setLatLongs=function(lls) {
	this.lls=lls;
};

/**
 * 
 * @returns {Array} Array of expedia.dmap.LatLong of this item. undefined if setLatLong is not set.
 */
expedia.dmap.Item.prototype.getLatLongs=function() {
	return this.lls;
};

/**
 * @returns {Object} the data associated with this object.
 */
expedia.dmap.Item.prototype.getData=function() {
	return this.data;
};

/**
 * Get the best guess LatLong for this Item or null.
 * @returns {expedia.dmap.LatLong} 
 */
expedia.dmap.Item.prototype.getLatLong=function() {
	var o=this.getLatLongs();
	if(o) {
		if(o.length==1) {
			return o[0];
		} else {
			// TODO support multi lat/lng region
			return null;
		}
	}
	return null;
};

// TODO toString

