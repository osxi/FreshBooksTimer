'use strict';

var FreshTrello = function() {
  this.projectNameSelector = "title:first";
  this.boardNameSelector = ".board-header-btn-text";
  this.cardNameSelector = ".window-title-text";
  this.addTimerWhenUrlChanges();
}

FreshTrello.prototype.getData = function() {
  var itemName, link, linkParts, projectName, _ref, _ref1;
  itemName = (_ref = document.querySelector(this.cardNameSelector)) != null ? _ref.innerText.trim() : void 0;
  projectName = (_ref1 = document.querySelector(this.boardNameSelector)) != null ? _ref1.innerText.trim() : void 0;
  link = window.location.href;
  linkParts = link.match(/^https:\/\/trello.com\/c\/([a-zA-Z0-9-]+)\/.*$/);
  return {
    project: {
      id: linkParts != null ? linkParts[1] : void 0,
      name: projectName
    },
    item: {
      id: linkParts != null ? linkParts[1] : void 0,
      name: itemName
    }
  };
};
FreshTrello.prototype.addTimer = function() {
  var timerContainer, timer;
  if(this.interval) { clearInterval(this.interval); }

  // TODO: fix
  // omg so bad. problem is I don't know when trello is finished loading and on
  // a full page change it tries to insert this before it finds the element
  setTimeout(function() {
    if($('#fb-timer').length) {
      return;
    }
    timerContainer = $('<a id="fb-timer" class="header-btn"></a>');
    timer = $('<span class="header-btn-text">00:00:00</span>');

    timerContainer.append(timer)

    $('.header-user').prepend(timerContainer);
    timerContainer.click(function() {
      chrome.runtime.sendMessage({action: "toggleTime"});
    });

    this.interval = setInterval(function() {
      chrome.runtime.sendMessage({action: "getTime"}, function(response) {
        timer.text(response.time);
      });
    }, 1000);
  }, 3000);

};

FreshTrello.prototype.addTimerWhenUrlChanges = function() {
  var ph, script,
    _this = this;
  script = document.createElement("script");
  script.innerHTML = "(" + (this.notifyOnUrlChanges.toString()) + ")()";
  ph = document.getElementsByTagName("script")[0];
  ph.parentNode.insertBefore(script, ph);
  return window.addEventListener("message", function(evt) {
    if (evt.source !== window) {
      return;
    }
    if (evt.data !== "urlChange") {
      return;
    }
    return _this.addTimer();
  });
};

FreshTrello.prototype.notifyOnUrlChanges = function() {
  var change, fn;
  change = function() {
    return window.postMessage("urlChange", "*");
  };
  fn = window.history.pushState;
  window.history.pushState = function() {
    fn.apply(window.history, arguments);
    return change();
  };
  return window.addEventListener("popstate", change);
};


$(function() {
  window.freshTrello = new FreshTrello();
});
