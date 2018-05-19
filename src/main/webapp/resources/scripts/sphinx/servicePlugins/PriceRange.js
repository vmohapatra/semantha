/**
 * Copyright 2015 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */
'use strict';

(function () {
  App.Services.PriceRange = App.Services.PriceRange || {

    config: {
      serviceUrl: '/sphinx/priceRange'
    },

    /**
     * Returns the price range data for price filtering given a currency code
     * @param {String} currencyCode - 3 letter currency code to get data for, e.g. 'USD'
     * @param {Function} callback - Callback method, called with (err, result)
     */
    getPriceRange: function (currencyCode, callback) {
      $.ajax({
        type: 'GET',
        url: this.config.serviceUrl,
        dataType: 'json',
        cache: false,
        data: {
          currencyCode: currencyCode
        },
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
