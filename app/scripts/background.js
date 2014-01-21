'use strict';

var $ = jQuery, stopwatch;

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var cardData = {};

var Timer = function(options) {
  if(options == null) {
    options = {};
  }
  this.hours = options.hours ? options.hours : 0.0;
  this.notes = options.notes ? options.notes : '';
}
var activeTimer = new Timer();
var openPort;

var setInactiveIcon = function() {
  chrome.browserAction.setIcon({path: 'images/icon-38-inactive.png'})
};
var setActiveIcon = function() {
  chrome.browserAction.setIcon({path: 'images/icon-38.png'})
};

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "freshbooks-trello");
  openPort = port;
  port.onMessage.addListener(function(msg) {
    if (msg.action == "startTimer") {
      setActiveIcon();
      if(!activeTimer) {
        activeTimer = new Timer();
      }
      if(msg.data && msg.data.notes) {
        activeTimer.notes = msg.data.notes
      }
      createStopwatch(activeTimer.hours);
      stopwatch.stopwatch('start');

    } else if (msg.action == "stopTimer") {
      setInactiveIcon();
      stopwatch.stopwatch('stop');

    } else if (msg.action == "resetTimer") {
      setInactiveIcon();
      stopwatch.stopwatch('reset');
      activeTimer = new Timer();

    }
  });
  port.onDisconnect.addListener(function() {
    openPort = null;
  });
});

var createStopwatch = function(startTime) {
  if(stopwatch) {
    stopwatch.stopwatch('destroy');
  }
  stopwatch = $('#stopwatch').stopwatch(
    {startTime: startTime * 1000}
  );
  stopwatch.bind('tick.stopwatch', function(e, elapsed) {
    var currentHours = (elapsed / 1000);
    activeTimer.hours = currentHours;
    if(openPort) {
      openPort.postMessage({
        action: 'tick',
        data: {
          time: elapsed
        }
      });
    }
  });
};

$(function() {
});

