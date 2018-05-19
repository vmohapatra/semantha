var Util=expedia.dmap.common.Utilities,
	toDeg=180/Math.PI;
Util.namespace("expedia.dmap");

/**
 * @public
 * @namespace Represents a single point of (Latitude,Longitude)
 * @param {Number} lat latitude
 * @param {Number} lng longitude
 * 
 * @Author  <mailto:svenz@expedia.com>Sven Zethelius</mailto>
 */
expedia.dmap.LatLong=function(lat,lng){
	if(lat==undefined||lng==undefined||lat>90.0||lat<-90.0)
		throw new Error("LatLong must define both lat and long");
	// normalize longitude
	while(lng>180.0)
		lng=lng-360.0;
	while(lng<-180.0)
		lng=lng+360.0;
	
	this.lat=lat;
	this.lng=lng;
};

/**
 * @public
 * @returns {Number} the latitude
 */
expedia.dmap.LatLong.prototype.getLat=function() {
	return this.lat;
};

/**
 * @public
 * @returns {Number} the longitude
 */
expedia.dmap.LatLong.prototype.getLong=function() {
	return this.lng;
};

/**
 * Get the Bounds representing the displayable area, centered on this LatLong.
 * 
 * @param heightpx height in pixels
 * @param widthpx width in pixels
 * @param zoom zoom level
 * @returns {expedia.dmap.Bounds}
 */
expedia.dmap.LatLong.prototype.getBoundsFromDisplayable=function(heightpx,widthpx,zoom) {
	var mapSize = 128 << zoom,
	// compute center as point in overall map.
		xCenter = getPixelX(this.getLong(), mapSize),
		yCenter = getPixelY(this.getLat(), mapSize),
	
	// compute offset lat/lngs
		latN = getLatFromPixelY(yCenter - heightpx / 2, mapSize),
		lngE = getLngFromPixelX(xCenter + widthpx / 2, mapSize),
		latS = getLatFromPixelY(yCenter + heightpx / 2, mapSize),
		lngW = getLngFromPixelX(xCenter - widthpx / 2, mapSize);
	return new expedia.dmap.Bounds(
				new expedia.dmap.LatLong(latN, lngE), 
				new expedia.dmap.LatLong(latS, lngW));
};

expedia.dmap.LatLong.prototype.toString=function() {
	return this.getLat()+','+this.getLong();
};

function getPixelX(lng, mapSize) {
	return mapSize + (lng * mapSize / 180);
};

function getLngFromPixelX(x, mapSize) {
	return (x - mapSize) / mapSize * 180;
};

function getPixelY(lat, mapSize) {
	var sinLat = Math.sin(lat/toDeg);
	return mapSize + (0.5 * Math.log((1 + sinLat) / (1 - sinLat)) * -(mapSize / Math.PI));
};

function getLatFromPixelY(y, mapSize) {
	return (2 * Math.atan(Math.exp((y - mapSize) / -mapSize * Math.PI)) - Math.PI / 2)*toDeg;
};

