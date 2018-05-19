var Util=aidep.dmap.common.Utilities;
Util.namespace("aidep.dmap");

/**
 * @namespace Item represents information about a map element, either a Hotel, Point of Interest, etc.
 * 
 * @param {String} type the type of the item
 * @param {String} id the unique id of the item within its type.
 * @param {Array} lls Array of {aidep.dmap.LatLong}
 * @returns {aidep.dmap.Item}
 */
aidep.dmap.Item=function(type,id,lls) {
	this.type=type;
	this.id=id;
	this.lls=lls;
	this.data={};
};

aidep.dmap.Item.prototype.getType=function() {
	return this.type;
};
aidep.dmap.Item.prototype.getId=function() {
	return this.id;
};

/**
 * @param {Array} lls Array of aidep.dmap.LatLong that represents the border or single point of the item.
 */
aidep.dmap.Item.prototype.setLatLongs=function(lls) {
	this.lls=lls;
};

/**
 * 
 * @returns {Array} Array of aidep.dmap.LatLong of this item. undefined if setLatLong is not set.
 */
aidep.dmap.Item.prototype.getLatLongs=function() {
	return this.lls;
};

/**
 * @returns {Object} the data associated with this object.
 */
aidep.dmap.Item.prototype.getData=function() {
	return this.data;
};

/**
 * Get the best guess LatLong for this Item or null.
 * @returns {aidep.dmap.LatLong} 
 */
aidep.dmap.Item.prototype.getLatLong=function() {
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

