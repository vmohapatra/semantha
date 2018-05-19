/**
 * Copyright 2015 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */
'use strict';

/**
 * Create and add the HotelSearch service to App.Services
 *
 */

(function ($, _, App) {

  /*
   * Private variables
   */

  var config = {
    serviceUrl: '/sphinx/HotelSearchService',
    validSortOrder: ['name', 'star', 'priceIncr', 'priceDesc'],
    tpid: 1,
    eapid: 1,
    sortOrder: '',
    threshold: 0.2
  };

  /*
   * Private methods
   */

  /**
   * Returns the object to be passed to `this.getResults` as the query parameters in the GET call
   * Sets the required [tpid, eapid, currency] and only adds extra values that are valid.
   *
   * @param {Object} params - Object of all the optional params that should be passed to HotelSearch.getResults
   *                          along with all the default values. `Params` can contain any of the following
   *                          keys with the specified type as the value:
   *
   *    query: {String} - The user query
   *    viewport: {String} - Viewport string of the form:  'SW-lat,SW-long,NE-lat,NE-long'
   *    amenities: {String} - Comma separated string of Nautilus id amenties
   *    starRating: {String} - Star rating filter string of the form: 'min,max' (1-5)
   *    name: {String} - Hotel name, used for string filtering
   *    price: {String} - Price range to filter by independent of currency. Strings of ints in the format 'min,max'
   *    zoom: {Number} - Integer value of the current map zoom level
   *
   * @returns {Object}
   *
   * @example
   *   getRequestQueryParams({
     *     query: 'seattle',
     *     viewport: '47.33381244621917,-122.81351821875,47.83677357440992,-121.605022125',
     *     price: '75,150',
     *     zoom: 10
     *   });
   *
   */
  var getRequestQueryParams = function (params) {

    var date1 = Date.parse($('#ip_dpfrom').val()),
      date2 = Date.parse($('#ip_dpto').val()),
      checkInDate = App.searchView.getCheckinDateString(new Date(date1)),
      lengthOfStay = getLengthOfStay(date1, date2),
      rooms = getRoomDetails(),
      sort = config.sortOrder,
      queryParams = {
        requestQuery: '',
        tpid: config.tpid,
        eapid: config.eapid,
        currency: getCurrencyCode()
      };

    if (_.isEmpty(params)) {
      return queryParams;
    }

    // UI inputs
    if (!_.isEmpty(checkInDate)) {
      queryParams.checkInDate = checkInDate;
    }
    if (_.isNumber(lengthOfStay)) {
      queryParams.lengthOfStay = lengthOfStay;
    }
    if (!_.isEmpty(rooms)) {
      queryParams.rooms = rooms;
    }
    if (!_.isEmpty(sort)) {
      queryParams.sort = sort;
    }

    // Param inputs
    if (!_.isEmpty(params.query)) {
      queryParams.requestQuery = params.query;
    }
    if (!_.isEmpty(params.viewport)) {
      queryParams.ll = params.viewport;
    }
    if (params.amenities != undefined) {
      queryParams.amn = params.amenities;
    }
    if (!_.isEmpty(params.starRating)) {
      queryParams.star = params.starRating;
    }
    if (!_.isEmpty(params.name)) {
      queryParams.name = params.name;
    }
    if (!_.isEmpty(params.price)) {
      queryParams.price = params.price;
    }
    if (_.isNumber(params.zoom) && params.zoom < 9) {
      queryParams['x-threshold'] = config.threshold;
    }

    return queryParams;
  };

  App.Services.HotelSearch = App.Services.HotelSearch || {

    /**
     * Set the sort order for hotels to be used on getResults call. The valid strings are:
     *   ['name', 'star', 'priceIncr', 'priceDesc']
     *
     * If given an invalid value, it is set to default no sort order. Call with null to reset to no sort order.
     *
     * @param {String} sort - Can be ['name', 'star', 'priceIncr', 'priceDesc'] or null to reset
     */
    setSortOrder: function (sort) {
      config.sortOrder = _.contains(config.validSortOrder, sort) ? sort : '';
    },

    /**
     * Return the current value of sort order
     *
     * @returns {String}
     */
    getSortOrder: function () {
      return config.sortOrder;
    },

    /**
     * Call the HotelSearch API with various search parameters, callback is passed (error, results)
     *
     * @param {Object} params - Object of all the optional params to be passed in the request with all
     *                          the default values. `params` can contain any of the following
     *                          keys with the specified type as the value:
     *
     *    query: {String} - The user query
     *    viewport: {String} - Viewport string of the form:  'SW-lat,SW-long,NE-lat,NE-long'
     *    amenities: {String} - Comma separated string of Nautilus id amenties
     *    starRating: {String} - Star rating filter string of the form: 'min,max' (1-5)
     *    name: {String} - Hotel name, used for string filtering
     *    price: {String} - Price range to filter by independent of currency. Strings of ints in the format 'min,max'
     *    zoom: {Number} - Integer value of the current map zoom level
     *
     * @param {Boolean} useNanoBar - Set to true to use the loading nano bar with the request
     * @param {Function} callback - Callback method, called with (error, result)
     */
    getResults: function (params, useNanoBar,callback) {
      $.ajax({
        type: 'GET',
        url: config.serviceUrl,
        dataType: 'json',
        data: getRequestQueryParams(params),
        beforeSend: function () {
          if (useNanoBar) {
            App.searchView.nanobar.go(50);
          }
        },
        success: function (result) {
          callback(null, result);
        },
        error: function (err) {
          callback(err);
        },
        complete: function () {
          // Always called after success or error called
          if (useNanoBar) {
            App.searchView.nanobar.go(100);
          }
          $('#lnk_search').css('display', 'block');
          $('#lnk_nosearch').css('display', 'none');
          isSearchInProgress = false;
        }
      });
    }
  };
}($, _, App));

