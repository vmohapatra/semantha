var Util=aidep.dmap.common.Utilities,
	LatLong=aidep.dmap.LatLong;
Util.namespace("aidep.dmap");

/**
 * @namespace A rectangle defined by its NorthEast and SouthWest LatLong
 * 
 * @param {aidep.dmap.LatLong} ne NorthEast point of the rectangle.
 * @param {aidep.dmap.LatLong} sw SouthWest point of the rectangle.
 * @returns {aidep.dmap.Bounds}
 */
aidep.dmap.Bounds = function(ne,sw) {	
	this.ne=ne;
	this.sw=sw;
};

/**
 * Compute Bounds from an array of {aidep.dmap.LatLong}
 * @param {Array} lls array of {aidep.dmap.LatLong}
 * @return {aidep.dmap.Bounds} the bounds that encapsulates the set of points
 */
aidep.dmap.Bounds.fromLatLongs = function(lls) {
	if(!lls || !lls.length)
		throw new Error("Unable to compute bounds from "+lls);
	var ll=lls[0];
		n=ll.getLat(),e=ll.getLong(),
		s=n,w=e;
	for(var idx=1;idx < lls.length; idx++) {
		ll=lls[idx];
		if(!ll) // IE treats [a,b,] as length 3 with lls[2]==null
			continue;

		var lat=ll.getLat(),
			lng=ll.getLong();
		if(n<lat) 
			n=lat;
		if(s>lat)
			s=lat;
		if(!(e >= w && (lng <= e && lng >= w)) && !(e < w && (lng <= e || lng >= w))) {
			var diffE = (lng - w + 720) % 360,
				diffW = (e - lng + 720) % 360;
			if (diffE <= diffW) {
				e = lng;
			} else {
				w = lng;
			}
		}
	}
	return new aidep.dmap.Bounds(new LatLong(n,e), new LatLong(s,w));
};

/**
 * Get the NorthEast point of the rectangle
 * @returns {aidep.dmap.LatLong}
 */
aidep.dmap.Bounds.prototype.getNorthEast=function() {
	return this.ne;
};

/**
 * Get the SouthWest point of the rectangle
 * @returns {aidep.dmap.LatLong}
 */
aidep.dmap.Bounds.prototype.getSouthWest=function() {
	return this.sw;
};

/**
 * Set the SouthWest point of the rectangle
 */
aidep.dmap.Bounds.prototype.setNorthEast=function(ne) {
	return this.ne = ne;
};

/**
 * Set the SouthWest point of the rectangle
 */
aidep.dmap.Bounds.prototype.setSouthWest=function(sw) {
	return this.sw = sw;
};

/**
 * Check if the given LatLong resides within this rectangle.
 * @param {aidep.dmap.LatLong} ll
 * @returns {Boolean} true if the point is within the bounds.
 */
aidep.dmap.Bounds.prototype.contains=function(ll) {
	return (this.sw.getLat() <= ll.getLat()) &&
			(ll.getLat() <= this.ne.getLat()) &&
			containsLongitude(this,ll.getLong());
};

function containsLongitude(b,lng) {
	var east = b.getNorthEast().getLong();
		west = b.getSouthWest().getLong();
	return (east >= west && (lng <= east && lng >= west))
	// if east<west, the bounds span the International Date Line, so test || instead
			|| (east < west && (lng <= east || lng >= west));

}
