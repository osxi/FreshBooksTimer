'use strict';
var $ = jQuery;

$(function() {
  chrome.tabs.executeScript(null, { file: "scripts/jquery.js" }, function() {
    chrome.tabs.executeScript(null, { file: "scripts/get_data.js" });
  });
});
var cardData = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cardData) {
      cardData = request.cardData;
      if(cardData.item.id) {
        $('#cardId').text(cardData.item.id);
      }
      if(cardData.item.name) {
        $('#cardName').text(cardData.item.name);
      }
      if(cardData.project.id) {
        $('#projectId').text(cardData.project.id);
      }
      if(cardData.project.name) {
        $('#projectName').text(cardData.project.name);
      }
    }
  }
);

