'use strict';
var $ = jQuery, hours = 0, stopwatch;
var port = chrome.runtime.connect({name: "freshbooks-trello"});

port.onMessage.addListener(function(msg){
  if(msg.action == 'tick' && msg.data && msg.data.time) {
    console.log('tick..', msg.data.time);
    stopwatch.text(Number(msg.data.time) / 1000);
  }
});

$(function() {
  stopwatch = $('#stopwatch');
  $('#stopwatch').text(chrome.extension.getBackgroundPage().activeTimer.hours);
  $('#notes').val(chrome.extension.getBackgroundPage().activeTimer.notes);
  chrome.tabs.executeScript(null, { file: "scripts/jquery.js" }, function() {
    chrome.tabs.executeScript(null, { file: "scripts/get_data.js" });
  });
  $('#start').click(function() {
    port.postMessage({
      action: 'startTimer',
      data: {
        notes: $('#notes').val()
      }
    });
  });
  $('#stop').click(function() {
    port.postMessage({action: 'stopTimer'});
  });
  $('#reset').click(function() {
    $('#notes').val('');
    port.postMessage({action: 'resetTimer'});
  });
  var api = new FreshbooksApi(),
      projects = api.getData('projects'),
      projectSelect = $('#project'),
      tasks = api.getData('tasks'),
      taskSelect = $('#task'),
      staffs = api.getData('staffs'),
      staffSelect = $('#staff');

  $.each(projects, function(key, project){
    var option = '<option value="'+project['project_id']+'">'+project['name']+'</option>';
    projectSelect.append(option);
  });
  $.each(tasks, function(key, task){
    var option = '<option value="'+task['task_id']+'">'+task['name']+'</option>';
    taskSelect.append(option);
  });
  $.each(staffs, function(key, staff){
    var option = '<option value="'+staff['staff_id']+'">'+staff['first_name']+' '+staff['last_name']+'</option>';
    staffSelect.append(option);
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
        if(!$('#notes').val().length > 0) {
          $('#notes').val(cardData.item.name);
        }
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

