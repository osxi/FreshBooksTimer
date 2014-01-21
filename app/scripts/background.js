'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var cardData = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(sender.tab ?
                //"from a content script:" + sender.tab.url :
                //"from the extension");
    if (request.cardData) {
      console.log(request.cardData);
      cardData = request.cardData;
    }
  }
);
