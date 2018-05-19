/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */

/**
 * A Backbone Model for a details pane item
 * @type {Backbone.Model}
 */
App.Models.DetailsPaneItem = Backbone.Model.extend({
  defaults: {
    currentHotelId: null, //Current Hotel EAN ID for hotel
    currentHotelName: '', //Name to be displayed
    currentHotelExpediaId: null, //Expedia ID of a given hotel
    currentHotelImage: '', //Travelnow hotel image
    currentHotelFullPrice: 0, //Numerical Full price for a hotel for dated search
    currentHotelDiscountPrice: 0,//Numerical Discount price for a hotel for dated search
    currentHotelDatelessPrice: "Choose date for price",//String indicating dates are mandatory for prices
    currentHotelStarRating: '',//Star rating of an hotel
    currentHotelReviewSummaries: null,//Object storing review summaries
	  currentHotelReviewScores: null,//Object storing review scores
	  currentHotelReviewReasonToBelieve: null,//Object storing review reasonToBelieve
    previousHotelId: null,// EAN Id of the previous hotel in the list
    nextHotelId: null//EAN Id of the next hotel in the list
  }
});
