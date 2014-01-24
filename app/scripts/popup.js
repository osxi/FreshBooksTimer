'use strict';
var $ = jQuery;
var port = chrome.runtime.connect({name: "freshbooks-trello"});

var flash, buttons, inputs, stopwatch, loading, activeTimer, currentHours;

var api           = new FreshbooksApi(),
    projects      = api.getData('projects'),
    tasks         = api.getData('tasks'),
    staffs        = api.getData('staffs');

function initialize() {
  var button, input;
  flash = {
    element: $('#flash'),
    _delayFadeOut: function() {
      var self = this;
      setTimeout(function() {
        self.element.fadeOut(function() {
          self.removeClass('success error');
        });
      }, 3000)
    },
    success: function(msg) {
      this.element.addClass('success').text(msg).fadeIn();
      this._delayFadeOut();
      return this;
    },
    error: function(msg) {
      this.element.addClass('error').text(msg).fadeIn();
      this._delayFadeOut();
      return this;
    }
  }
  button = function(selector) {
    return {
      element: $(selector),
      text: function(txt) {
        if(txt == null) {
          return this.element.text();
        }
        return this.element.text(txt);
      }
    }
  };
  buttons = {
    toggle: button('#toggle'),
    reset: button('#reset'),
    submit: button('#submit')
  };
  input = function(selector) {
    return {
      element: $(selector),
      name: function() {
        return this.element.attr('name');
      },
      text: function(txt) {
        return this.element.text(txt);
      },
      val: function(data) {
        if(data == null) {
          return this.element.val();
        }
        return this.element.val(data)
      }
    }
  };
  inputs = {
    notes: input('#notes'),
    project: input('#project'),
    staff: input('#staff'),
    task: input('#task'),
    hours: input('#hours')
  };
  stopwatch = $('#stopwatch');
  loading = $('#loading');
  activeTimer = chrome.extension.getBackgroundPage().activeTimer;
}

port.onMessage.addListener(function(msg){
  if(msg.action == 'tick') {
    stopwatch.text(msg.data.formatted);
    buttons.toggle.text('Pause');

    if(!inputs.hours.element.is(':focus')) {
      currentHours = Number(msg.data.hours).toFixed(2);
      inputs.hours.val(currentHours);
    }
  } else if(msg.action == 'tickUpdate') {
    stopwatch.text(msg.data.formatted);
    buttons.toggle.text('Start');
    currentHours = Number(msg.data.hours).toFixed(2)
    inputs.hours.val(currentHours);
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cardData) {
      var cardData = request.cardData;
      if(cardData.item.name) {
        if(inputs.notes.val().trim().length === 0) {
          inputs.notes.val(parseNote(cardData.item.name));
        } else if(!chrome.extension.getBackgroundPage().activeTimer.running) {
          flash.error('Tried to load Trello Card title but there was already data in the notes section.');
        }
        // TODO: automatically select project from dropdown with this cardData.project.name
      }
    }
  }
);

// removes actual time that's applied from from Scrum for Trello
function parseNote(note) {
  var regex = /\[[\d.]+\]\s?/g;
  return note.replace(regex, '');
}

function resetToggleButtonText() {
  if(buttons.toggle.text().trim() === 'Pause') {
    buttons.toggle.text('Start');
  }
}

function populateSelectBoxOptions() {
  if(projects && projects.length) {
    $.each(projects, function(key, project){
      var option = '<option value="'+project['project_id']+'">'+project['name']+'</option>';
      inputs.project.element.append(option);
    });
  }
  if(tasks && tasks.length) {
    $.each(tasks, function(key, task){
      var option = '<option value="'+task['task_id']+'">'+task['name']+'</option>';
      inputs.task.element.append(option);
    });
  }
  if(staffs && staffs.length) {
    $.each(staffs, function(key, staff){
      var option = '<option value="'+staff['staff_id']+'">'+staff['first_name']+' '+staff['last_name']+'</option>';
      inputs.staff.element.append(option);
    });
  }
}
function populateSelectBoxValues() {
  if(activeTimer) {
    stopwatch.text(activeTimer.formatted());
    inputs.hours.val(Number(activeTimer.hours).toFixed(2));

    if(activeTimer.notes) {
      inputs.notes.val(activeTimer.notes);
    }
    if(activeTimer.staff_id) {
      var num = Number(activeTimer.staff_id.replace(/\"/g, ''));
      inputs.staff.val(num);
    }
    if(activeTimer.project_id) {
      var num = Number(activeTimer.project_id.replace(/\"/g, ''));
      inputs.project.val(num);
    }
    if(activeTimer.task_id) {
      var num = Number(activeTimer.task_id.replace(/\"/g, ''));
      inputs.task.val(num);
    }
  }
}

window.onload = function() {
  initialize();

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  // Input Click Bindings
  ////////////////////////////////////////////////////////

  // Toggle timer
  buttons.toggle.element.click(function() {
    if(buttons.toggle.text().trim() === 'Start') {
      port.postMessage({
        action: 'startTimer',
        data: {
          notes: $('#notes').val(),
          staff_id: $('#staff').val(),
          project_id: $('#project').val(),
          task_id: $('#task').val()
        }
      });
      buttons.toggle.text('Pause');
    } else {
      port.postMessage({action: 'pauseTimer'});
      buttons.toggle.text('Start');
    }
  });

  // Reset timer
  buttons.reset.element.click(function() {
    inputs.notes.val('');
    port.postMessage({action: 'resetTimer'});
    resetToggleButtonText();
  });

  // On hours change, update stopwatch hours
  inputs.hours.element.on('change', function() {
    port.postMessage({action: 'setTimer', data: { hours: inputs.hours.val().trim() }});
    resetToggleButtonText();
  });

  // Submit time entry to Freshbooks
  buttons.submit.element.click(function() {
    port.postMessage({action: 'pauseTimer'});
    buttons.toggle.text('Start');
    var xhr = api.createTimeEntry({
      project_id:  inputs.project.val(),
      task_id:     inputs.task.val(),
      staff_id:    inputs.staff.val(),
      notes:       inputs.notes.val(),
      hours:       currentHours
    });

    loading.fadeIn();

    xhr.done(function() {
      port.postMessage({action: 'resetTimer'});
      inputs.notes.val('');
      flash.success('Submitted.')
    }).fail(function() {
      flash.error('Failed. Please try again later.')
    }).always(function() {
      loading.fadeOut();
    });
  });

  //////////////////////////////////////////////////////////////
  // End Input Click Bindings
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  populateSelectBoxOptions();
  populateSelectBoxValues();

  // it's important this is executed after the values are loaded from memory
  // and set. if not, data pulled from the page will be set before it loads
  // them from the background.js
  chrome.tabs.executeScript(null, { file: "scripts/jquery.js" }, function() {
    chrome.tabs.executeScript(null, { file: "scripts/get_data.js" });
  });

  // initialize select2 on inputs
  inputs.staff.element.select2({
    placeholder: '-- Select Staff --',
    width: '100%'
  });
  inputs.project.element.select2({
    placeholder: '-- Select Project --',
    width: '100%'
  });
  inputs.task.element.select2({
    placeholder: '-- Select Task --',
    width: '100%'
  });

}

// this is triggered when the popup is closed to persist the entered data to the
// timer
addEventListener("unload", function (event) {
  $.each(inputs, function(key, input) {
    if(key != 'hours') {
      activeTimer[input.name()] = input.val();
    }
  });
}, true);
