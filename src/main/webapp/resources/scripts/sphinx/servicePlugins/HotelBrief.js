/**
 * Copyright 2015 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */
'use strict';

(function () {

  /**
   * Private method
   * Get the url params to call with on hotelbrief
   *
   * @param {String} hotelId
   * @returns {Object} object to be passed into ajax call as data
   */
  var getBriefParams = function (hotelId) {

    var arrivalDate = $("#ip_dpfrom").val(),
        departureDate = $("#ip_dpto").val(),
        regex = new RegExp("&", 'g'),
        query = $('#ip_travelRequest').val().replace(regex,'%26'),
        tags = '';


    if (arrivalDate == null || arrivalDate == getLocalizedDatePickerDefaultStartDate()) {
      arrivalDate = '';
    }
    if (departureDate == null || departureDate == getLocalizedDatePickerDefaultEndDate()) {
      departureDate = '';
    }
    if (nlpAmenityIds != null) {
      tags = nlpAmenityIds.join();
    }

    return {
      hotelId: hotelId,
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      tags: tags,
      query: query,
      searchQueryId: capture.getSearchQueryId(),
      browserGUID: capture.getBrowserGuid(),
      roomdetails: getRoomDetails() || ''
    };
  };

  App.Services.HotelBrief = App.Services.HotelBrief || {

    config: {
      briefServiceUrl: '/sphinx/hotelbrief'
    },

    /**
     * Returns the hotel brief content
     * @param {String} hotelId
     * @param {Function} callback - Callback method, called with (err, result), on success err will be null.
     */
    getHotelBriefContent: function (hotelId, callback) {

      var params = getBriefParams(hotelId);

      $.ajax({
        type: 'GET',
        url: this.config.briefServiceUrl,
        cache: false,
        data: params,
        success: function (result) {
          callback(null, result);
        },
        error: function (err) {
          callback(err);
        }
      });
    }
  };
}());
