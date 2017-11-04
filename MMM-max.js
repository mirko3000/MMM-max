/* global Module */

/* Magic Mirror
 * Module: MMM-max
 *
 * By mirko3000
 * MIT Licensed.
 */
  var cache = [];
  var cacheIndex = [];

Module.register('MMM-max', {

  requiresVersion: "2.0.0",

  defaults: {
    fade: true,
    fadePoint: 0.25,
    maxIP: '192.168.0.252',
    maxPort: 62910,
    updateInterval: 5,
    twoColLayout: false
  },



  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
      if (notification === 'MAX_DATA') {
          Log.info('received MAX_DATA');
          this.render(payload);
          this.updateDom(3000);
      }
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.update();
    // refresh every x minutes
    setInterval(
      this.update.bind(this),
      this.config.updateInterval * 60 * 1000);
  },

  update: function(){
    var maxConfig = {
      maxIP: this.config.maxIP,
      maxPort: this.config.maxPort
    };

    this.sendSocketNotification(
      'MAX_UPDATE', maxConfig);
  },

  getScripts: function() {
    return [
      'String.format.js',
      'https://code.jquery.com/jquery-2.2.3.min.js',  // this file will be loaded from the jquery servers.
    ]
  },

  getStyles: function() {
    return ['MMM-max.css'];
  },

  getDom: function() {
    var content = '';
    if (!this.loaded) {
      content = this.html.loading;
    }else { 
      content = '<ul>'+this.dom+'</ul>';
    }
    return $('<div class="max">'+content+'</div>')[0];
  },


  html: {
    table: '<table>{0}</table>',
    col: '<td align="left" class="normal light small">{0}</td><td align="left" class="dimmed light xsmall">{1}°C</td><td align="left" class="dimmed light xsmall">{2}°C</td><td align="left" class="dimmed light xsmall">{3}%</td><td class="dimmed xsmall light"><div class="fa fa-1 {4}"></div></td>',
    row: '<tr>{0}{1}</tr>',
    room: '<li><div class="room xsmall">{0} : {1}°C</div></li>',
    loading: '<div class="dimmed light xsmall">Connecting to MAX! cube...</div>',
  },

  render: function(data){
      var previousCol =''
      var rowCount = 0;
      var tableText = ''
      $.each(data, function (i, item) {
        if (item.deviceInfo.device_type === 1) {

          var room = {
            id: item.rf_address,
            name: item.deviceInfo.room_name,
            temp: item.temp,
            setpoint: item.setpoint,
            valve: item.valve,
            mode: item.mode
          };

          // Get previously cached entry - if exists
          if (cacheIndex.indexOf(room.id) != -1) {
            var cacheRoom = cache[cacheIndex.indexOf(room.id)];

            // Check if temp is better from cache then current value
            if (room.temp === 0) {
              room.temp = cacheRoom.temp;
            }

            // Update cache
            cache[cacheIndex.indexOf(room.id)] = room;
          }
          else {
            // Create new entry in cache
            cacheIndex[cacheIndex.length] = room.id;
            cache[cache.length] = room;
          }

          // sometimes the temperature ist not given, initialize it with "-"
          if (!room.temp) {
            room.temp = '-';
          }

          var icon = "";
          // Check for automatic or manual mode
          if (room.mode === "VACATION") {
            icon = "fa-plane";
          }
          else if (room.mode === "AUTO") {
            icon = "fa-dashboard";
          } else {
            icon = "fa-hand-stop-o";
          }

          var currCol = this.html.col.format(room.name, room.setpoint, room.temp, room.valve, icon);

          if (i%2!=0 || !this.config.twoColLayout) {
            // start new row
            tableText += this.html.row.format(previousCol, currCol);
            previousCol = '';
            rowCount++;
          }
          else {
            previousCol = currCol;
          }

        }

        //text += this.renderRoom(room, mode, temp, valve, time_until, locked);
      }.bind(this));

      // Print last row if uneven
      if (previousCol != '') {
        tableText += this.html.row.format(previousCol, '');
        previousCol = '';
        rowCount++;
      }

      text = this.html.table.format(tableText);

      this.loaded = true;

      // only update dom if content changed
      if(this.dom !== text){
        this.dom = text;
        this.updateDom(this.config.animationSpeed);
      }
  },

});
