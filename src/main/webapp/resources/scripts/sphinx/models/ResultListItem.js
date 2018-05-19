/**
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */

/**
 * A Backbone Model for a results list item
 * @type {Backbone.Model}
 */
App.Models.ResultListItem = Backbone.Model.extend({

  defaults: {
    itemType: '', //cluster or hotel
    itemId: null, // aidep id, duplicated as we moved off of DMaps and on to Nautilus
    itemName: '', //Name to be displayed
    itemShortName: '', //Short name for hotel clusters
    itemaidepId: null, //aidep ID of a given hotel. null for clusters
    itemMapContent: null, //DMAP content. Includes lat longs for both clusters and hotels
    itemImage: '', //Travelnow hotel image
    itemSize: 0, //Number of hotels for a cluster
    itemPrice: 0, //Numerical price for a hotel
    itemFormattedPrice: '', //Formatted price for a hotel
    itemStarRating: '', //Star rating of an hotel
    itemReview: null, //Object storing review details for an hotel
	  itemReasonToBelieve: null // Object storing reasonToBelieve
  },

  /**
   * Initialize a cluster model
   */
  initializeCluster: function () {
    var newId = this.get('itemId').replace(/[,\.\s'\(\)]/g,'_'),
        shortName = this.get('itemName').split(',')[0];

    this.set({
      itemId: newId,
      itemShortName: shortName
    });
  },

  /**
   * Takes a long data string and converts it to readable Date string
   * using Date().format('mm/dd')
   * @param  {string} date - date string
   * @return {string} Date string in 'mm/dd'
   */
  formatDate: function(date) {
    var temp = date.substring(0,10).replace(/\-/g,'/');
    return new Date(temp).format('mm/dd');
  }
});
