/**
 * @Author  <mailto:smyrick@expedia.com>Shane Myrick</mailto>
 */

// Global Marionette App setup
window.App = new Backbone.Marionette.Application();

// Reference containers
App.Models = {};
App.Views = {};
App.Collections = {};
App.Layouts = {};
App.Services = {};

// Regions are areas to add Backbone.Views into
App.addRegions({
  headerRegion: '#div_headerContainer',
  filterbarRegion: '#div_filterBarOuterContainer',
  listRegion: '#div_resultsListContainer',
  mapRegion: '#div_mapContainer',
  detailsPaneRegion: '#div_detailsPaneContainer'
});

// Add variables that will be created on start
App.addInitializer(function(options) {
	var isSearchPage = document.getElementById('div_resultsListContainer');
	if(isSearchPage != null) {
		// Declare a new CollectionView and pass in the List Collection
		App.listView = new App.Views.ResultListView({
		  collection: new App.Collections.ResultList()
		});	

		// Create a new SearchView attached to the global App
		App.searchView = new App.Views.SearchView();
		// Set the region in which the ListView is rendered
		App.listRegion.show(App.listView);
    App.nautilusHotels = [];
	}

});

// For Debugging 
App.on('start', function() {
  //Backbone.history.start();
  //console.log('Started Application');
});
