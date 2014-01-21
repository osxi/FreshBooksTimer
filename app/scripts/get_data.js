'use strict';

var FreshTrello = function() {
  this.projectNameSelector = "title:first";
  this.boardNameSelector = ".board-header-btn-text";
  this.cardNameSelector = ".window-title-text";
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


$(function() {
  var freshTrello = new FreshTrello();
  var cardData = freshTrello.getData();
  chrome.runtime.sendMessage({cardData: cardData});
});
