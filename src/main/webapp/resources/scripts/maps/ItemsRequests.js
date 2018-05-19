/*
 * This file describes the complex items used in Map.addItemRequests
 */
var 
	Util=expedia.dmap.common.Utilities;

Util.namespace("expedia.dmap");

/**
 * @namespace data holder to request hotel items.  At least one of the properties must be set.
 * @property {expedia.dmap.DateRange} dates.  Optional
 * @property {Boolean} deal has a GDE deal associated.  Optional
 * @property {expedia.dmap.NumberRange} price min/max price.  Optional
 * @property {expedia.dmap.NumberRange} star min/max Star rating of the hotel.  10=1star,...,50=5star.  max is assumed 50 if not specified.  Optional
 */
expedia.dmap.HotelItemsRequest=function(){
};

/**
 * @namespace data holder to request a specific date range.
 * @property {Date} min minimum date of checkin to the hotel.  Required
 * @property {Date} max maximum date of checkin to the hotel.  Required.  TODO confirm end is checkin
 * @property {NumberRange} los min/max to satisfy.  Optional
 * @property {Array} startDays Array of {Number}, Allowed Day of Week of checkin. 1=sunday,...,7=saturday. Optional.  If not specified, defaults to All days.
 * 
 */
expedia.dmap.DateRange=function() {
};

/**
 * @namespace data holder to request a specific number range.
 * @property {Number} min
 * @property {Number} max
 */
expedia.dmap.NumberRange=function() {
};
