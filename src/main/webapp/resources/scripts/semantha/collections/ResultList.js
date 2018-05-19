/**
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */

/**
 * A Backbone Collection representing the results list. Contains ListItems
 * @type {Backbone.Collection}
 */
App.Collections.ResultList = Backbone.Collection.extend({

  model: App.Models.ResultListItem,

  /**
   * Get an array of all hotels that have a defined price in the model
   * @returns {Array} hotel ids
   */
  getHotelIdsWithPrice: function () {
    return this.chain()
      .filter(this.itemHasPrice)
      .map(this.getItemaidepId)
      .value();
  },

  itemHasPrice: function (item) {
    return (item.get('itemPrice') != 0);
  },

  getItemaidepId: function (item) {
    return item.get('itemaidepId');
  }
});
