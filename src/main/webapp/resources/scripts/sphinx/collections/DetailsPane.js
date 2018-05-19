/**
 * @Author  <mailto:vmohapatra@aidep.com>Vijayalaxmi Mohapatra</mailto>
 */

/**
 * A Backbone Collection representing the Details Pane. Contains individual hotel's details in a pane
 * @type {Backbone.Collection}
 */
App.Collections.DetailsPane = Backbone.Collection.extend({
  model: App.Models.DetailsPaneItem
});
