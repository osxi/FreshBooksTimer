'use strict';

var $ = jQuery, stopwatch, project_id, task_id, staff_id;
project_id = localStorage['store.settings.defaultProject'];
staff_id = localStorage['store.settings.defaultStaff'];
task_id = localStorage['store.settings.defaultTask'];

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

var Timer = function(options) {
  if(options == null) {
    options = {};
  }

  this.seconds    = options.seconds ? options.seconds : 0;
  this.minutes    = options.minutes ? options.minutes : 0;
  this.hours      = options.hours ? options.hours : 0.0;
  this.notes      = options.notes ? options.notes : '';
  this.project_id = project_id;
  this.staff_id   = staff_id;
  this.task_id    = task_id;
  this.running    = false;
}
Timer.prototype.setSeconds = function(seconds) {
  this.seconds = seconds;
  this.minutes = this.seconds / 60;
  this.hours = this.minutes / 60;
}
Timer.prototype.formatted = function() {
  function pad2(number) {
    return (number < 10 ? '0' : '') + number;
  }
  function defaultFormatMilliseconds(seconds) {
      var x = seconds, minutes, hours;
      seconds = Math.floor(x % 60)
      x /= 60;
      minutes = Math.floor(x % 60);
      x /= 60;
      hours = Math.floor(x % 24);
      return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
  }
  return defaultFormatMilliseconds(this.seconds);
}
var activeTimer = new Timer();
var openPort;

var setInactiveIcon = function() {
  chrome.browserAction.setIcon({path: 'images/icon-38-inactive.png'})
  activeTimer.running = false;
};
var setPausedIcon = function() {
  chrome.browserAction.setIcon({path: 'images/icon-38-paused.png'})
  activeTimer.running = false;
};
var setActiveIcon = function() {
  chrome.browserAction.setIcon({path: 'images/icon-38-active.png'})
  activeTimer.running = true;
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
      if(msg.data) {
        if(msg.data.notes) {
          activeTimer.notes = msg.data.notes
        }
        if(msg.data.project_id) {
          activeTimer.project_id = msg.data.project_id
        }
        if(msg.data.task_id) {
          activeTimer.task_id = msg.data.task_id
        }
        if(msg.data.staff_id) {
          activeTimer.staff_id = msg.data.staff_id
        }
      }

      stopwatch.stopwatch('start');

    } else if (msg.action == 'pauseTimer') {
      setPausedIcon();
      stopwatch.stopwatch('stop');

    } else if (msg.action == "resetTimer" || msg.action == "setTimer") {
      var seconds = 0;
      if(msg.action == "resetTimer") {
        setInactiveIcon();
        activeTimer = new Timer();
      } else {
        setPausedIcon();
      }

      if(msg.data && msg.data.hours) {
        seconds = msg.data.hours * 60 * 60;
      }

      createStopwatch(seconds);
      activeTimer.setSeconds(seconds);

      // manually post tick to update popup
      port.postMessage({
        action: 'tickUpdate',
        data: {
          time: activeTimer.seconds * 1000,
          hours: activeTimer.hours,
          formatted: activeTimer.formatted()
        }
      })
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
    var currentSeconds = (elapsed / 1000);
    activeTimer.setSeconds(currentSeconds);
    if(openPort) {
      openPort.postMessage({
        action: 'tick',
        data: {
          time: elapsed,
          hours: activeTimer.hours,
          formatted: activeTimer.formatted()
        }
      });
    }
  });
};

$(function() {
  createStopwatch(0);
});
