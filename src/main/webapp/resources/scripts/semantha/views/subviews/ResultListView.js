/**
 * @Author  <mailto:smyrick@expedia.com>Shane Myrick</mailto>
 */
'use strict';
/**
 * Marionette ItemView for each list item. Implicily uses the ListItem Model.
 * Connection is automatically setup by Marionette when delcaring the CollectionView.
 */
App.Views.ResultListItemView = Backbone.Marionette.ItemView.extend({

  tagName: 'div',

  /**
   * Set all HTML attributes, called by Marionette after initialization
   * @return {Object} Returns an Object with the attributes name and prospective text
   *                  to Marionette to be added to HTML template
   */
  attributes: function() {
    var attrs = {},
        itemType = this.getModelType();

    if (itemType === 'hotel') {
      attrs = {
        id: 'h' + this.model.get('itemId'),
        'class': 'searchsItem clearfix', 
        hotelid: this.model.get('itemExpediaId')
      };
    }
    else if (itemType === 'hotelcluster') {
      attrs = {
        id: 'h' + this.model.get('itemId'),
        'class': 'searchsItem clearfix cluster',
        onclick: 'centerBasedZoom(' + this.model.get('itemMapContent').position.lat + ',' + this.model.get('itemMapContent').position.lng + ')'
      };
    }

    return attrs;
  },

  /**
   * Returns a rendered HTML template using Marionette.TemplateCache
   * @return {HTML}
   */
  getTemplate: function() {
    var itemType = this.getModelType();
    if (itemType === 'hotel') {
      return Backbone.Marionette.TemplateCache.get("#listItemHotelTemplate");
    }
    else if (itemType === 'hotelcluster') {
      return Backbone.Marionette.TemplateCache.get("#listItemClusterTemplate");
    }
    else if (itemType === 'partialDivider') {
      return Backbone.Marionette.TemplateCache.get("#listPartialDividerTemplate");
    }
  },

  /**
   * Called by Marionette when a new item is added to the collection
   */
  initialize: function() {
    $('#div_resultsList').css('height', $('#div_mapAndListContainer').outerHeight()-$('#div_resultsInfoContainer').outerHeight());

    if (this.getModelType() === 'hotelcluster') {
      this.model.initializeCluster();
    }
    this.model.on('change', this.render, this);
  },

  /**
   * Gets the 'itemType' value from the model
   * @returns {string} 'itemType' value
   */
  getModelType: function () {
    return this.model.get('itemType');
  }

});

/**
 * Marionette CollectionView representing the results list. Each item in the list is a ListItemView
 * which uses the ListItem Model.
 */
App.Views.ResultListView = Backbone.Marionette.CollectionView.extend({

  tagName: 'div',
  id: 'div_resultsList',
  childView: App.Views.ResultListItemView,
  maxResultCount: 200,
  maxAggrResultCount: 40,

  /**
   * Add a ListItem to the collection
   * @param item - ListItem model to be added to the collection with a ListItemView ItemView
   */
  addItem: function(item) {
    this.collection.add(item);
  }

});
