'use strict';

$(function() {
  console.log('parser!');
  var cardData = freshTrello.getData();
  if(cardData) {
    chrome.runtime.sendMessage({cardData: cardData});
  }
});
