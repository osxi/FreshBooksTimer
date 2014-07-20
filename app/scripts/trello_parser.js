'use strict';

$(function() {
  var cardData = freshTrello.getData();
  if (cardData) {
    chrome.runtime.sendMessage({cardData: cardData});
  }
});
