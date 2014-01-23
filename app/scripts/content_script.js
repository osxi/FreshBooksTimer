$(function() {
  var timerContainer, timer;
        timerContainer = $('<a id="fb-timer" class="header-btn"></a>');
        timer = $('<span class="header-btn-text">00:00:00</span>');
        timerContainer.append(timer)
        $('.header-user').prepend(timerContainer);

  timerContainer.click(function() {
    chrome.runtime.sendMessage({action: "toggleTime"});
  });

  setInterval(function() {
    chrome.runtime.sendMessage({action: "getTime"}, function(response) {
      timer.text(response.time);
    });
  }, 1000);
});
