/**
 * Copyright 2015 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */
'use strict';

/*
 *
 * TODO: Implement exact api calls once backend Java servlet is complete.
 * This is just a place holder for now.
 */
(function (App, $) {

  App.Services.Gemma = App.Services.Gemma || {

    config: {
      serviceUrl: '',
      serverDataUrl: gemmaServerData
    },

    /**
     * Get the server data info
     * @param {Function} callback - Called with two params (err, result)
     */
    getServerData: function (callback) {
      $.ajax({
        dataType: 'json',
        url: this.config.serverDataUrl,
        success: function (result) {
          callback(null, result);
        },
        error: function (err) {
          callback(err);
        }
      });
    },

    setUrl: function (url) {
      this.config.serviceUrl = url;
    },

    /**
     * Get the gemma version
     * @param {Function} callback - Called with two params (err, result)
     */
    getVersion: function (callback) {

      $.ajax({
        url: this.config.serviceUrl,
        dataType: 'xml',
        success: function (result) {
          callback(null, result);
        },
        error: function (err) {
          callback(err);
        }
      });
    }
  };
}( App, jQuery ));
