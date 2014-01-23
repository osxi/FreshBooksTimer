'use strict';
var $ = jQuery, stopwatch, hours, currentHours,
    port = chrome.runtime.connect({name: "freshbooks-trello"});

port.onMessage.addListener(function(msg){
  hours = $('#hours');
  if(msg.action == 'tick') {
    stopwatch.text(msg.data.formatted);
    $('#toggle').text('Pause');

    if(!hours.is(':focus')) {
      currentHours = Number(msg.data.hours).toFixed(2)
      hours.val(currentHours);
    }
  } else if(msg.action == 'tickUpdate') {
    stopwatch.text(msg.data.formatted);
    $('#toggle').text('Start');
    currentHours = Number(msg.data.hours).toFixed(2)
    hours.val(currentHours);
  }
});

// removes actual time that's applied from from Scrum for Trello
function parseNote(note) {
  var regex = /\[[\d.]+\]\s?/g;
  return note.replace(regex, '');
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cardData) {
      var cardData = request.cardData;
      if(cardData.item.name) {
        if($('#notes').val().trim().length === 0) {
          $('#notes').val(parseNote(cardData.item.name));
        } else if(!chrome.extension.getBackgroundPage().activeTimer.running) {
          $('#flash').addClass('error')
            .text('Tried to load Trello Card title but there was already data in the notes section.')
            .fadeIn();
        }
        // TODO: select project from dropdown with this cardData.project.name
      }
    }
  }
);

window.onload = function() {
  $(function() {
    var toggle = $('#toggle');
    stopwatch = $('#stopwatch');

    toggle.click(function() {
      var btn = $(this);
      if(btn.text().trim() === 'Start') {
        port.postMessage({
          action: 'startTimer',
          data: {
            notes: $('#notes').val(),
            staff_id: $('#staff').val(),
            project_id: $('#project').val(),
            task_id: $('#task').val()
          }
        });
        btn.text('Pause');
      } else {
        port.postMessage({action: 'pauseTimer'});
        btn.text('Start');
      }
    });
    function resetToggleButtonText() {
      if(toggle.text().trim() === 'Pause') {
        toggle.text('Start');
      }
    }
    $('#reset').click(function() {
      $('#notes').val('');
      port.postMessage({action: 'resetTimer'});
      resetToggleButtonText();
    });
    $('#hours').on('change', function() {
      port.postMessage({action: 'setTimer', data: { hours: $(this).val().trim() }});
      resetToggleButtonText();
    });
    var api           = new FreshbooksApi(),
        projects      = api.getData('projects'),
        projectSelect = $('#project'),
        tasks         = api.getData('tasks'),
        taskSelect    = $('#task'),
        staffs        = api.getData('staffs'),
        staffSelect   = $('#staff');

    $('#submit').click(function() {
      port.postMessage({action: 'pauseTimer'});
      toggle.text('Start');
      var xhr = api.createTimeEntry({
        project_id: projectSelect.val(),
        task_id: taskSelect.val(),
        staff_id: staffSelect.val(),
        notes: $('#notes').val(),
        hours: currentHours
      });
      $('#loading').fadeIn();
      xhr.then(function() {
        port.postMessage({action: 'resetTimer'});
        $('#notes').val('');
        $('#flash').text('Submitted!').addClass('success').fadeIn();
      });
      xhr.fail(function() {
        $('#flash').text('Failed. Try again later.').addClass('error').fadeIn();
      });
      xhr.always(function() {
        setTimeout(function() {
          $('#flash').fadeOut(function() {
            $(this).text('')
          }).removeClass('error').removeClass('success');
        }, 3000);

        $('#loading').fadeOut();
      });
    });

    if(projects && projects.length) {
      $.each(projects, function(key, project){
        var option = '<option value="'+project['project_id']+'">'+project['name']+'</option>';
        projectSelect.append(option);
      });
    }
    if(tasks && tasks.length) {
    $.each(tasks, function(key, task){
      var option = '<option value="'+task['task_id']+'">'+task['name']+'</option>';
      taskSelect.append(option);
    });
    }
    if(staffs && staffs.length) {
      $.each(staffs, function(key, staff){
        var option = '<option value="'+staff['staff_id']+'">'+staff['first_name']+' '+staff['last_name']+'</option>';
        staffSelect.append(option);
      });
    }


    var notes, staff, project, task,
        activeTimer = chrome.extension.getBackgroundPage().activeTimer;

    if(activeTimer) {
      console.log("active timer!");
      stopwatch.text(activeTimer.formatted());
      $('#hours').text(Number(activeTimer.hours).toFixed(2));

      if(notes = activeTimer.notes) {
        $('#notes').val(notes);
      }
      if(staff = activeTimer.staff_id) {
        var num = Number(staff.replace(/\"/g, ''));
        $('#staff').val(num);
      }
      if(project = activeTimer.project_id) {
        var num = Number(project.replace(/\"/g, ''));
        $('#project').val(num);
      }
      if(task = activeTimer.task_id) {
        var num = Number(task.replace(/\"/g, ''));
        $('#task').val(num);
      }
    }

    // it's important this is executed after the values are loaded from memory
    // and set. if not, data pulled from the page will be set before it loads
    // them from the background.js
    chrome.tabs.executeScript(null, { file: "scripts/jquery.js" }, function() {
      chrome.tabs.executeScript(null, { file: "scripts/get_data.js" });
    });

    $('#staff').select2({
      placeholder: '-- Select Staff --',
      width: '100%'
    });
    $('#project').select2({
      placeholder: '-- Select Project --',
      width: '100%'
    });
    $('#task').select2({
      placeholder: '-- Select Task --',
      width: '100%'
    });

  });
}

// this is triggered when the popup is closed to persist the entered data to the
// timer
addEventListener("unload", function (event) {
  $.each(['notes', 'project', 'staff', 'task'], function(id, key) {
    var item = $('#'+key);
    chrome.extension.getBackgroundPage().activeTimer[item.attr('name')] = item.val();
  });
}, true);
