'use strict';

var $ = jQuery, stopwatch, openPort, icon,
    project_id = localStorage['store.settings.defaultProject'],
    staff_id = localStorage['store.settings.defaultStaff'],
    task_id = localStorage['store.settings.defaultTask'],
    activeTimer = new Timer();

icon = {
  deactivate: function() {
    chrome.browserAction.setIcon({path: 'images/icon-38-inactive.png'})
    activeTimer.running = false;
  },
  activate: function() {
    chrome.browserAction.setIcon({path: 'images/icon-38-active.png'})
    activeTimer.running = true;
  },
  pause: function() {
    chrome.browserAction.setIcon({path: 'images/icon-38-paused.png'})
    activeTimer.running = false;
  }
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "freshbooks-trello");
  console.log('got connection!');
  openPort = port;
  port.onMessage.addListener(function(msg, _, sendResponse) {
    if (msg.action == "startTimer") {
      icon.activate();
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
      icon.pause();
      stopwatch.stopwatch('stop');

    } else if (msg.action == "resetTimer" || msg.action == "setTimer") {
      var seconds = 0;

      if(msg.action == "resetTimer") {
        icon.deactivate();
        activeTimer = new Timer();
      } else {
        icon.pause();
        seconds = msg.data.hours * 60 * 60;
      }

      createStopwatch(seconds);
      activeTimer.setSeconds(seconds);

      // manually tick to update popup data since it will be paused and wont
      // emit a tick
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
    var tickData = {
      action: 'tick',
      data: {
        time: elapsed,
        hours: activeTimer.hours,
        formatted: activeTimer.formatted()
      }
    }
    if(openPort) {
      openPort.postMessage(tickData);
    }
  });
};

// coming from trello content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getTime") {
      sendResponse({time: activeTimer.formatted()});
    } else if (request.action == 'toggleTime') {
      if(activeTimer.running) {
        icon.pause();
        stopwatch.stopwatch('stop');
      } else {
        icon.activate();
        stopwatch.stopwatch('start');
      }
    }
  }
);


$(function() {
  createStopwatch(0);
});
