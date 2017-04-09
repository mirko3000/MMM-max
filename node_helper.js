"use strict";

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');

var MaxCube = require('./maxcube');
module.exports = NodeHelper.create({


  start: function () {
    console.log("Starting max helper");
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, url, port) {
    if (notification === 'MAX_UPDATE') {
      var self = this;
      var myMaxCube  = new MaxCube(url, port);
      myMaxCube.on('connected', function () {

        myMaxCube.getDeviceStatus().then(function (devices) {

          for (i = 0; i < devices.length; i++) { 
              devices[i].deviceInfo = myMaxCube.getDeviceInfo(devices[i].rf_address);
            }
            self.sendSocketNotification('MAX_DATA', devices);
           myMaxCube.close();
        });
      });
    }
  }
});
