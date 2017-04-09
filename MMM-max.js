/* global Module */

/* Magic Mirror
 * Module: max
 *
 * By Mirko Bleyh
 * MIT Licensed.
 */
Module.register('MMM-max', {
  defaults: {
    fade: true,
    fadePoint: 0.25,
    maxIP: '192.168.0.252',
    maxPort: 62910,
    updateInterval: 5,
    twoColLayout: false
  },

  //var data;

  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
      if (notification === 'MAX_DATA') {
          Log.info('received MAX_DATA');
          this.render(payload);
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
    this.sendSocketNotification(
      'MAX_UPDATE', this.config.maxIP, this.config.maxPort);
  },

  parsePayload: function (payload) {
  
    return 'parse';
  },

  getScripts: function () {
    return [
      'String.format.js',
  		//this.file('maxcube-commandfactory.js'), // this file will be loaded straight from the module folder.
  		//this.file('maxcube-commandparser.js'), // this file will be loaded straight from the module folder.
  		//this.file('maxcube-lowlevel.js'), // this file will be loaded straight from the module folder.
    ];
  },

  getDom: function() {
    var content = '';
    if (!this.loaded) {
      content = this.html.loading;
    }else { 
      content = '<ul>'+this.dom+'</ul>';
    }
    return $('<div>'+content+'</div>')[0];
  },

  getStyles: function () {
    return ["font-awesome.css"];
  },

  html: {
    table: '<table>{0}</table>',
    col: '<td align="left" class="normal light small">{0}</td><td align="left" class="dimmed light xsmall">{1}°C</td><td align="left" class="dimmed light xsmall">{2}°C</td><td align="left" class="dimmed light xsmall">{3}%</td>',
    row: '<tr>{0}{1}</tr>',
    room: '<li><div class="room xsmall">{0} : {1}°C</div></li>',
    loading: '<div class="dimmed light xsmall">Connecting to MAX! cube...</div>',
  },

  render: function(data){
      var previousCol =''
      var rowCount = 0;
      var tableText = ''
      $.each(data, function (i, item) {
        var room = item.deviceInfo.room_name;
        var mode = item.mode;
        var temp = item.temp;
        var valve = item.valve;
        var setpoint = item.setpoint;
        var time_until = item.time_until;
        var locked = item.panel_locked;

        var currCol = this.html.col.format(room, setpoint, temp, valve);

        if (i%2!=0 || !this.config.twoColLayout) {
          // start new row
          tableText += this.html.row.format(previousCol, currCol);
          previousCol = '';
          rowCount++;
        }
        else {
          previousCol = currCol;
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
