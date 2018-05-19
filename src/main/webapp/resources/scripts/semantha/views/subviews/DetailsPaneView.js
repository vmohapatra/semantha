/**
 * @Author  <mailto:vmohapatra@aidep.com>Vijayalaxmi Mohapatra</mailto>
 */

/**
 * Marionette ItemView for each details pane item. Implicily uses the DetailsPaneItem Model.
 * Connection is automatically setup by Marionette when delcaring the CollectionView.
 */
App.Views.DetailsPaneItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'div',
  /**
   * Set all HTML attributes, called by Marionette after initialization
   * @return {Object} Returns an Object with the attributes name and prospective text
   * to Marionette to be added to HTML template
   */
  attributes: function() {
    var attrs = {};

    attrs = {
        id: 'div_' + this.model.get('currentHotelId'),
        "class": 'details-pane full-height', 
        aidepId: this.model.get('currentHotelaidepId')
    };

    return attrs;
  },
  /**
   * Returns a rendered HTML template using Marionette.TemplateCache
   * @return {HTML}
   */
  getTemplate: function() {
    return Backbone.Marionette.TemplateCache.get("#detailsPaneItemTemplate");
  },
  /**
   * Called by Marionette when a new item is added to the collection
   */
  initialize: function() {
	this.model.on('change', this.render,this);
  },
 /**
  *  Things to do when we render the details pane item
  */
 onRender: function() {
    $('#div_detailsPaneContainer').css("height", $('#div_mapContainer').outerHeight());
    $('#div_detailsPane').css("height", $('#div_mapContainer').outerHeight());
    $('.details-pane').css("height", $('#div_mapContainer').outerHeight());
    var navHeight = $('.details-pane-nav').outerHeight() > 50 ? $('.details-pane-nav').outerHeight() : 50;
    $('.details-pane-content').css("height", $('#div_mapContainer').outerHeight()- navHeight );
  }
});

/**
 * Marionette CollectionView representing the results list. Each item in the list is a ListItemView
 * which uses the ListItem Model.
 */
App.Views.DetailsPaneView = Backbone.Marionette.CollectionView.extend({

  tagName: 'div',
  id: 'div_detailsPane',
  childView: App.Views.DetailsPaneItemView,
  /**
   * Set all HTML attributes, called by Marionette after initialization
   * @return {Object} Returns an Object with the attributes name and prospective text
   * to Marionette to be added to HTML template
   */
  attributes: function() {
    var attrs = {};

    attrs = {
        "class": 'full-height'
    };

    return attrs;
  },
  /**
   * Add a ListItem to the collection
   * TODO: Add methods to call external servelts such as Review 
   *       and SSL before adding to the collection.
   * @param {ListItem} item ListItem model to be added to the collection with a ListItemView ItemView
   */
  addDetailsPaneContent: function(item) {
    this.collection.add(item);
  },
  /**
   * Specifying things to do on render of details pane view
   */
   onRender: function() {
    $('#div_detailsPaneContainer').css("height", $('#div_mapContainer').outerHeight());
    $('#div_detailsPane').css("height", $('#div_mapContainer').outerHeight());
    $('.details-pane').css("height", $('#div_mapContainer').outerHeight());
    var navHeight = $('.details-pane-nav').outerHeight() > 50 ? $('.details-pane-nav').outerHeight() : 50;
    $('.details-pane-content').css("height", $('#div_mapContainer').outerHeight()- navHeight );
   }    
});
