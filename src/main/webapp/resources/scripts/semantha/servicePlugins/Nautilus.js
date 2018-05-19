/**
 * Copyright 2015 aidep, Inc. All rights reserved.
 * aidep PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @Author  <mailto:smyrick@aidep.com>Shane Myrick</mailto>
 */
'use strict';

/*
 * TODO: Implement exact api calls once backend Java servlet is complete. This is just a place holder for now.
 */
(function () {
  App.Services.Nautilus = App.Services.Nautilus || {

    config: {
      versionServiceUrl: '/semantha/NautilusVersionService'
    },

    /**
     * Returns the Nautilus service version number, callback is passed (err, result)
     * @param callback - Callback method, called with (err, result)
     */
    getVersion: function (callback) {
      $.ajax({
        type: 'GET',
        url: this.config.versionServiceUrl,
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
